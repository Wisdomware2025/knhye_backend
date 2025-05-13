import Schedule from "../../models/Schedule.js"
import { scheduledJobs, scheduleJob } from "node-schedule"
import moment from "moment"
import { sendNotification } from "../../firebase/fcm.js"

// export async function getSchedules() {
//   return await Schedule.find()
// }

export async function getScheduleByDate(date) {
  //타임존에 관계없이 정확한 날짜 계산을 위해 moment-timezone 사용
  const start = moment.tz(date, "Asia/Seoul").startOf("day").toDate()
  const end = moment(date, "Asia/Seoul").endOf("day").toDate()

  return await Schedule.find({
    date: { $gte: start, $lt: end },
  })
}

export async function getScheduleById(scheduleId) {
  return await Schedule.findById(scheduleId)
}

export async function createOne({ date, data, userId, fcmToken }) {
  try {
    const schedule = new Schedule({
      date,
      data,
      author: userId,
      fcmToken,
    })

    return await schedule.save()
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function updateOne({ scheduleId, date, data, userId }) {
  try {
    const schedule = await Schedule.findById(scheduleId)
    if (!schedule) throw { status: 404, message: "일정이 없습니다." }

    if (schedule.author.toString() !== userId)
      throw { status: 403, message: "권한이 없습니다." }

    schedule.set({
      date,
      data,
    })
    return await schedule.save()
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteOne(req) {
  try {
    const schedule = await Schedule.findById(req.params.id)

    if (!schedule) throw { status: 404, message: "일정을 찾을 수 없습니다." }

    if (schedule.author.toString() !== req.user.id)
      throw { status: 403, message: "권한이 없습니다." }

    await schedule.deleteOne()
  } catch (err) {
    console.log(err)
    throw err
  }
}

//메세지
const NOTIFICATION_DATES = [{ day: 0, message: "일정 당일입니다!" }]

export async function scheduleNotificationJob(targetDate) {
  try {
    // 특정 날짜에 해당하는 일정을 찾아오는 변수
    const scheduleEntry = await Schedule.findOne({ date: targetDate })
    if (!scheduleEntry) throw new Error("해당 날짜에 일정이 없습니다.")

    //moment-timezone 사용
    const dateMoment = moment.tz(scheduleEntry.date, "YYYY-MM-DD", "Asia/Seoul")

    const work = scheduleEntry.work
    const fcmToken = scheduleEntry.fcmToken || "" // 토큰 처리 필요

    //토큰이 빈 문자열이면 전송 시 실패
    if (!fcmToken || fcmToken.trim() === "") {
      console.warn("유효하지 않은 FCM 토큰")
      return
    }

    NOTIFICATION_DATES.forEach(({ day, message }) => {
      //알림을 보낼 날짜
      const time = dateMoment.clone().add(day, "days").toDate()
      // 알림 본문
      const body = `${work} - ${message}`
      //등록된 job 식별하기
      const jobName = `${scheduleEntry.id}_${day}`

      // 오늘 00:00:00을 기준으로 비교
      const now = moment().startOf("day").toDate()
      if (time < now) {
        return
      }

      //같은 시간, 같은 알림의 내용의 작업이 여러번 등록 => 알림 중복 전송
      //node-schedule은 내부적으로 중복 예약을 막지 않음
      //date를 정수로 바꿔서 비교해야함
      if (
        !scheduledJobs[jobName] ||
        scheduledJobs[jobName].nextInvocation().getTime() !== time
      ) {
        //time에 맞춰서 함수 실행
        scheduleJob(jobName, time, async () => {
          try {
            // sendNotification 호출
            await sendNotification(fcmToken, body)
          } catch (err) {
            console.error(`알림 전송 실패: ${err.message}`)
          }
        })
      } else {
        console.log("예약 중복")
      }
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}
