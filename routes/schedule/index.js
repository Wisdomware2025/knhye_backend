import {
  getAllSchedules,
  getScheduleDday,
  getRecentSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../controllers/schedule/index.js"

import authMiddleware from "../../middlewares/auth/index.js"

import { Router } from "express"
const router = Router()

router.get("/", authMiddleware, getAllSchedules)
router.get("/recent", authMiddleware, getRecentSchedule)
router.get("/:date", authMiddleware, getScheduleDday)

router.post("/", authMiddleware, createSchedule)
router.put("/:id", authMiddleware, updateSchedule)
router.delete("/:id", authMiddleware, deleteSchedule)
export default router
