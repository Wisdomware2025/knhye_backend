import ScheduleService from "../../services/schedule/index.js"
import moment from "moment-timezone"
import Schedule from "../../models/schedule/Schedule.js"
import { sendNotification } from "../../firebase/fcm.js"
import mongoose from "mongoose"

const scheduleService = new ScheduleService({
  Schedule,
  sendNotification,
})

export async function getAllSchedules(req, res) {
  try {
    const schedules = await scheduleService.getSchedules()

    if (!schedules) {
      return res.json({ message: "일정이 없음" })
    }

    return res.json(schedules)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "스케줄 불러오기 실패" })
  }
}

export async function getScheduleDday(req, res) {
  try {
    let dateToSearch = req.params.date
    const parsedMomentDate = moment.tz(dateToSearch, "YYYY-MM-DD", "Asia/Seoul")

    if (!parsedMomentDate.isValid()) {
      return res.status(400).json({
        message:
          "유효하지 않은 날짜 형식입니다. YYYY-MM-DD 형식을 사용해주세요.",
      })
    }

    const validDateForService = parsedMomentDate.toDate()

    const schedule = await scheduleService.getScheduleByDate(
      validDateForService
    )

    if (!schedule) return res.status(404).json({ message: "일정이 없습니다." })

    return res.json(schedule)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "스케줄 불러오기 실패" })
  }
}

export async function getRecentSchedule(req, res) {
  try {
    const schedule = await scheduleService.getRecentSchedule()

    if (!schedule) return res.status(404).json({ message: "일정이 없습니다." })

    return res.json(schedule)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "스케줄 불러오기 실패" })
  }
}

export async function createSchedule(req, res) {
  try {
    const date = req.params.date
    const data = {
      ...req.body,
    }
    const author = req.user.userId

    //파라미터를 중괄호로 묶지 않을 경우 순서를 기억해야함
    //객체 디스트럭처링 파라미터로 보낼 것
    const schedule = await scheduleService.createOne({ date, data, author })
    return res.status(201).json(schedule)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: "스케줄 생성 실패" })
  }
}

export async function updateSchedule(req, res) {
  try {
    const scheduleId = req.params.id
    const date = req.params.date
    const userId = req.user.userId
    const data = req.body
    const updated = await scheduleService.updateOne({
      scheduleId,
      date,
      data,
      userId,
    })
    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(err.status || 400).json({ message: "스케줄 업데이트 실패" })
  }
}

export async function deleteSchedule(req, res) {
  try {
    const scheduleId = new mongoose.Types.ObjectId(req.params)
    const userId = req.user.userId
    await scheduleService.deleteOne({ scheduleId, userId })
    return res.json({ message: "일정이 삭제되었습니다." })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 400).json({ message: "스케줄 삭제 실패" })
  }
}

export async function scheduleJob(req, res) {
  try {
    const { id } = req.params

    if (!id || typeof id !== "string") {
      return res.status(400).send({ message: "유효한 스케줄 ID가 필요합니다." })
    }

    await scheduleService.scheduleNotificationJob(id)

    return res.send({ message: "알림이 성공적으로 예약되었습니다." })
  } catch (err) {
    console.error("알림 예약 중 오류 발생:", err)

    return res.status(500).send({ message: "서버 오류" })
  }
}
