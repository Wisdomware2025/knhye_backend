import {
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

router.get("/recent", getRecentSchedule)
router.get("/:date", getScheduleDday)

router.post("/:date", scheduleMiddleware, createSchedule)
router.put("/:date/:id", scheduleMiddleware, updateSchedule)
router.delete("/:id", deleteSchedule)
router.post("/schedule-job/:id", scheduleJob)
export default router
