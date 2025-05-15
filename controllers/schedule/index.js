import {
  // getSchedules,
  getScheduleByDate,
  getScheduleById,
  createOne,
  updateOne,
  deleteOne,
  scheduleNotificationJob,
} from "../../services/schedule/index.js"
import moment from "moment"

// export async function getAllSchedules(req, res) {
//   try {
//     const schedules = await getSchedules()
//     res.json(schedules)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: "스케줄 불러오기 실패" })
//   }
// }

export async function getScheduleDday(req, res) {
  try {
    const schedule = await getScheduleByDate(req.params.date)
    if (!schedule) return res.status(404).json({ message: "일정이 없습니다." })
    res.json(schedule)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "스케줄 불러오기 실패" })
  }
}

export async function getSchedule(req, res) {
  try {
    const schedule = await getScheduleById(req.params.id)
    if (!schedule) return res.status(404).json({ message: "일정이 없습니다." })
    res.json(schedule)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "스케줄 불러오기 실패" })
  }
}

export async function createSchedule(req, res) {
  try {
    const date = req.params.date
    const data = req.body
    const userId = req.user.id

    //파라미터를 중괄호로 묶지 않을 경우 순서를 기억해야함
    //객체 디스트럭처링 파라미터로 보낼 것
    const schedule = await createOne({ date, data, userId })
    res.status(201).json(schedule)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "스케줄 생성 실패" })
  }
}

export async function updateSchedule(req, res) {
  try {
    const scheduleId = req.params.id
    const date = req.params.date
    const userId = req.user.id
    const data = req.body
    const updated = await updateOne({ scheduleId, date, data, userId })
    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(err.status || 400).json({ message: "스케줄 업데이트 실패" })
  }
}

export async function deleteSchedule(req, res) {
  try {
    await deleteOne(req)
    res.json({ message: "일정이 삭제되었습니다." })
  } catch (err) {
    console.log(err)
    res.status(err.status || 400).json({ message: "스케줄 삭제 실패" })
  }
}

export async function scheduleJob(req, res) {
  try {
    const { date } = req.body

    if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({ message: "유효하지 않은 날짜" })
    }

    await scheduleNotificationJob(date)
    res.send({ message: "알림이 전송되었습니다." })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: "알림 전송 실패" })
  }
}
