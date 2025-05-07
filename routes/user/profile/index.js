import { Router } from "express"
import {
  getProfile,
  updateProfileSetting,
} from "../../../controllers/user/profile/index.js"
import authMiddleware from "../../../middlewares/auth/index.js"

const router = Router()

router.get("/", getProfile)

router.put("/setting", authMiddleware, updateProfileSetting)

export default router
