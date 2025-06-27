import ScheduleService from "../../services/schedule/index.js"
import moment from "moment-timezone"
import Schedule from "../../models/schedule/Schedule.js"
import { sendNotification } from "../../firebase/fcm.js"
import mongoose from "mongoose"

const scheduleService = new ScheduleService({
  Schedule,
  sendNotification,
})

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.findAllSchedules()

    return res.json(schedules)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err })
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

    const schedule = await scheduleService.getScheduleByDate({
      dateInput: validDateForService,
    })

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
    const data = {
      ...req.body,
    }
    const author = req.user.userId

    if (!data) {
      return res
        .status(400)
        .json({ message: "입력 오류. 날짜와 데이터를 정확히 입력해주세요." })
    }

    if (!author) {
      return res.status(403).json({ message: "로그인해주세요" })
    }

    const schedule = await scheduleService.createOne({ data, author })
    return res.status(201).json(schedule)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "스케줄 생성 실패" })
  }
}

export async function updateSchedule(req, res) {
  try {
    const scheduleId = req.params.id
    const userId = req.user.userId
    const data = {
      ...req.body,
    }
    const updated = await scheduleService.updateOne({
      scheduleId,
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
    const scheduleId = req.params.id
    const userId = req.user.userId

    const isDeleted = await scheduleService.deleteOne({
      scheduleId,
      userId,
    })

    if (!isDeleted) {
      return res.status(500).json({ message: "삭제되지 않았습니다." })
    }

    return res.json({ message: "일정이 삭제되었습니다." })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 400).json({ message: "스케줄 삭제 실패" })
  }
}
