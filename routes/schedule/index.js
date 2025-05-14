import { Router } from "express"
const router = Router()

import {
  getScheduleDday,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  scheduleJob,
} from "../../controllers/schedule/index.js"

import authMiddleware from "../../middlewares/auth/index.js"
import scheduleMiddleware from "../../middlewares/schedule/index.js"

router.get("/:date", authMiddleware, getScheduleDday)
router.get("/:id", authMiddleware, getSchedule)
router.post("/:date", authMiddleware, scheduleMiddleware, createSchedule)
router.put("/:date/:id", authMiddleware, scheduleMiddleware, updateSchedule)
router.delete("/:id", authMiddleware, deleteSchedule)
router.post("/schedule-job", authMiddleware, scheduleJob)
export default router
