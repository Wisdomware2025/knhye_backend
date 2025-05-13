import { Router } from "express"
const router = Router()

import {
  getAllSchedules,
  getScheduleDday,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  scheduleJob,
} from "../../controllers/schedule/index.js"

import authMiddleware from "../../middlewares/auth/index.js"
import scheduleMiddleware from "../../middlewares/schedule/index.js"

router.get("/notification", authMiddleware, scheduleJob)
router.get("/", authMiddleware, getAllSchedules)
router.get("/:date", authMiddleware, getScheduleDday)
router.post("/:date", authMiddleware, scheduleMiddleware, createSchedule)
router.put("/:id", authMiddleware, scheduleMiddleware, updateSchedule)
router.delete("/:id", authMiddleware, deleteSchedule)

export default router
