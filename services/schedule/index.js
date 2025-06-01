import Schedule from "../../models/schedule/Schedule.js"
import { scheduledJobs, scheduleJob } from "node-schedule"
import moment from "moment"
import { sendNotification } from "../../firebase/fcm.js"

export async function getScheduleByDate(date) {
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
    const scheduleEntry = await Schedule.findOne({ date: targetDate })
    if (!scheduleEntry) throw new Error("해당 날짜에 일정이 없습니다.")

    const dateMoment = moment.tz(scheduleEntry.date, "YYYY-MM-DD", "Asia/Seoul")

    const work = scheduleEntry.work
    const fcmToken = scheduleEntry.fcmToken || "" // 토큰 처리 필요

    if (!fcmToken || fcmToken.trim() === "") {
      console.warn("유효하지 않은 FCM 토큰")
      return
    }

    NOTIFICATION_DATES.forEach(({ day, message }) => {
      //알림을 보낼 날짜
      const time = dateMoment.clone().add(day, "days").toDate()
      // 알림 제목
      const title = `${message}`
      // 알림 본문
      const body = `오늘의 일정 : ${work}`
      //등록된 job 식별하기
      const jobName = `${scheduleEntry.id}_${day}`

      // 오늘 00:00:00을 기준으로 비교
      const now = moment().startOf("day").toDate()
      if (time < now) {
        return
      }

      if (
        !scheduledJobs[jobName] ||
        Math.abs(
          scheduledJobs[jobName].nextInvocation().getTime() - time.getTime()
        ) > 1000
      ) {
        scheduleJob(jobName, time, async () => {
          try {
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
