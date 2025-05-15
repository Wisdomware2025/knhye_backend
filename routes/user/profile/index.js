import {
  getProfile,
  updateProfileSetting,
} from "../../../controllers/user/profile/index.js"
import authMiddleware from "../../../middlewares/auth/index.js"
import { Router } from "express"
const router = Router()

router.get("/", getProfile)

router.put("/setting", authMiddleware, updateProfileSetting)

export default router
