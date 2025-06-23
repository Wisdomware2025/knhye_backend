import {
  getAllSchedules,
  getScheduleDday,
  getRecentSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  scheduleJob,
} from "../../controllers/schedule/index.js"

import authMiddleware from "../../middlewares/auth/index.js"
import scheduleMiddleware from "../../middlewares/schedule/index.js"
import { Router } from "express"
const router = Router()

router.get("/", authMiddleware, getAllSchedules)
router.get("/recent", authMiddleware, getRecentSchedule)
router.get("/:date", authMiddleware, getScheduleDday)

router.post("/:date", authMiddleware, scheduleMiddleware, createSchedule)
router.put("/:date/:id", authMiddleware, scheduleMiddleware, updateSchedule)
router.delete("/:id", authMiddleware, deleteSchedule)
router.post("/schedule-job/:id", authMiddleware, scheduleJob)
export default router
