import { scheduledJobs, scheduleJob } from "node-schedule"
import moment from "moment-timezone" // moment-timezone 사용

// 알림 메시지 정의 (확장된 예시)
const NOTIFICATION_DATES = [
  { day: -7, message: "일정 일주일 전 알림!" },
  { day: -1, message: "일정 하루 전 알림!" },
  { day: 0, message: "오늘의 일정 알림!" },
]

// 최대 알림 재시도 횟수
const MAX_RETRY_ATTEMPTS = 2 // 총 3회 시도

class ScheduleService {
  constructor({ Schedule, User, sendNotification }) {
    this.Schedule = Schedule
    this.User = User
    this.sendNotification = sendNotification
    this.scheduledJobs = scheduledJobs // node-schedule의 scheduledJobs 참조
  }

  // 미결 스케줄 알림 초기화
  async initializeScheduledNotifications() {
    try {
      const allSchedules = await this.Schedule.find({
        notificationSent: false,
      })

      for (const entry of allSchedules) {
        const scheduleDateMoment = moment
          .tz(entry.startDate, "Asia/Seoul")
          .startOf("day")
        const now = moment().startOf("day")

        // 가장 빠른 알림 날짜 (예: 7일 전)가 현재 또는 미래인 스케줄만 고려
        const earliestNotificationTime = scheduleDateMoment
          .clone()
          .add(NOTIFICATION_DATES[0].day, "days")

        if (earliestNotificationTime.isSameOrAfter(now, "day")) {
          await this.scheduleNotificationJob(entry._id) // _id를 사용하여 스케줄을 찾도록 변경
        }
      }
    } catch (err) {
      throw new Error("스케줄 처리 못함")
    }
  }

  async scheduleNotificationJob({ id }) {
    try {
      // 'author'를 populate하여 사용자 세부 정보를 가져옵니다.
      const scheduleEntry = await this.Schedule.findById(id)

      if (!scheduleEntry || !scheduleEntry.author) {
        throw new Error("스케줄이나 작성자가 없습니다.")
      }

      const userFcmTokens = scheduleEntry.author.fcmTokens
      if (!userFcmTokens || userFcmTokens.length === 0) {
        // 특정 사용자의 fcmTokens가 없거나 비어있을 경우
        // 'throw new Error("FCM 토큰이 존재하지 않음")' 대신 경고를 로깅하고 함수를 종료하는 것이 더 적절할 수 있습니다.
        // 왜냐하면 토큰이 없는 사용자는 알림을 받지 못할 뿐, 시스템에 오류를 발생시키지는 않으니까요.
        console.warn(
          `사용자 ${scheduleEntry.author.username}의 FCM 토큰이 존재하지 않습니다.`
        )
        return // 함수 종료
      }

      const dateMoment = moment.tz(scheduleEntry.startDate, "Asia/Seoul") // 시간 정보를 포함한 moment 객체
      const work = scheduleEntry.work

      // 현재 날짜를 00:00:00으로 설정하여 과거 알림을 방지
      const now = moment().startOf("day").toDate()

      NOTIFICATION_DATES.forEach(({ day, message }) => {
        //알림을 보낼 시간
        const notificationTime = dateMoment.clone().add(day, "days").toDate()
        const title = `${message}`
        const body = `${scheduleEntry.title || "일정"}: ${work}`

        // 등록된 job 식별하기: 고유성을 위해 스케줄 ID와 day를 사용
        const jobName = `${scheduleEntry._id}_${day}`

        // 스케줄된 시간이 현재 시간보다 이전이면 건너뛰기
        if (notificationTime < now) {
          return
        }

        // jobName으로 이미 스케줄된 작업이 있는지, 시간이 변경되었는지
        // 작업의 다음 예약 호출 시간과 notificationTime 사이의 절대적인 시간 차이가 1초보다 큰지 확인
        if (
          !this.scheduledJobs[jobName] ||
          Math.abs(
            this.scheduledJobs[jobName].nextInvocation().getTime() -
              notificationTime.getTime()
          ) > 1000
        ) {
          this.scheduledJobs[jobName] = scheduleJob(
            jobName,
            notificationTime,

            async () => {
              let attempts = 0

              while (attempts < MAX_RETRY_ATTEMPTS + 1) {
                try {
                  await this.sendNotification(userFcmTokens, title, body)

                  scheduleEntry.notificationSent = true
                  break // 성공 시 루프 종료
                } catch (err) {
                  attempts++
                  if (attempts < MAX_RETRY_ATTEMPTS + 1) {
                    // 선택 사항: 재시도 전 지연 추가 (예: 지수 백오프)
                    await new Promise((resolve) =>
                      setTimeout(resolve, 1000 * attempts)
                    )
                  }
                }
              }
            }
          )
        }
      })
      return true
    } catch (err) {
      throw err
    }
  }

  async cancelExistingNotificationJobs({ scheduleId }) {
    NOTIFICATION_DATES.forEach(({ day }) => {
      const jobName = `${scheduleId}_${day}`
      if (this.scheduledJobs[jobName]) {
        this.scheduledJobs[jobName].cancel()
        delete this.scheduledJobs[jobName] // 객체에서 삭제하여 메모리 정리
      }
    })
  }

  async findAllSchedules() {
    const schedules = await this.Schedule.find()

    return schedules.map((schedule) => ({
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      work: schedule.work,
    }))
  }

  async getScheduleByDate({ dateInput }) {
    let momentDate

    if (dateInput instanceof Date) {
      // 이미 Date 객체라면 직접 사용
      momentDate = moment.tz(dateInput, "Asia/Seoul")
    } else if (typeof dateInput === "string") {
      // 문자열이라면, moment가 인식하는 표준 형식인지 확인
      // 만약 클라이언트에서 'YYYY-MM-DD' 형식으로 보낸다면
      momentDate = moment.tz(dateInput, "YYYY-MM-DD", "Asia/Seoul")
    } else {
      // Date 객체도 문자열도 아니라면, 유효하지 않은 입력으로 간주
      throw new Error("유효하지 않은 날짜 입력 형식입니다.")
    }

    // Moment 객체가 유효한지 확인
    if (!momentDate.isValid()) {
      throw new Error(
        `유효하지 않은 날짜 값입니다: ${dateInput}. 올바른 날짜 형식을 제공해주세요.`
      )
    }

    const start = moment.tz(dateInput, "Asia/Seoul").startOf("day").toDate()
    const end = moment.tz(dateInput, "Asia/Seoul").endOf("day").toDate()

    const schedules = await this.Schedule.find({
      startDate: { $gte: start, $lt: end },
    })

    if (!schedules || schedules.length === 0) {
      return []
    }

    return schedules
  }

  async getRecentSchedule() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const schedules = await this.Schedule.find({
      startDate: { $gte: today },
    })
      .sort({ date: 1 })
      .limit(3)
      .lean()

    if (!schedules) {
      throw new Error("스케줄을 찾을 수 없습니다.")
    }

    return schedules.map((schedule) => ({
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      workers: schedule.workers,
      work: schedule.work,
      location: schedule.location,
    }))
  }

  async createOne({ data, author }) {
    try {
      const schedule = new this.Schedule({
        ...data,
        author,
      })
      const savedSchedule = await schedule.save()

      if (!savedSchedule) {
        throw new Error("스케줄 생성 실패함")
      }

      // 스케줄 생성 후 알림 스케줄링
      await this.scheduleNotificationJob({ id: savedSchedule._id })

      return savedSchedule
    } catch (err) {
      throw err
    }
  }

  async updateOne({ scheduleId, data, userId }) {
    try {
      const schedule = await this.Schedule.findById(scheduleId)
      if (!schedule) throw { status: 404, message: "일정을 찾을 수 없습니다." }

      if (schedule.author.toString() !== userId)
        throw { status: 403, message: "권한이 없습니다." }

      // 기존 알림 작업 취소
      await this.cancelExistingNotificationJobs(scheduleId)

      schedule.set({
        ...data, // data 객체 전체를 업데이트
      })
      const updatedSchedule = await schedule.save()

      // 업데이트된 스케줄로 알림 재스케줄링
      await this.scheduleNotificationJob({ id: updatedSchedule._id })
      console.log(
        `[ScheduleService] 스케줄 ID: ${scheduleId} 업데이트 및 알림 재스케줄링 완료.`
      )
      return updatedSchedule
    } catch (err) {
      console.error(
        `[ScheduleService] 스케줄 업데이트 중 오류 발생: ${err.message}`,
        err
      )
      throw err
    }
  }

  async deleteOne({ scheduleId, userId }) {
    try {
      const schedule = await this.Schedule.findById(scheduleId)

      if (!schedule) throw { status: 404, message: "일정을 찾을 수 없습니다." }

      if (schedule.author.toString() !== userId.toString())
        throw { status: 403, message: "권한이 없습니다." }

      // 스케줄 삭제 전 관련 알림 작업 취소
      await this.cancelExistingNotificationJobs({ scheduleId: schedule._id })

      await schedule.deleteOne()

      return true
    } catch (err) {
      throw err
    }
  }
}

export default ScheduleService
