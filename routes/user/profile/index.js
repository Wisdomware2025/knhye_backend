import {
  getFamousUsers,
  getProfile,
  updateProfileSetting,
} from "../../../controllers/user/profile/index.js"
import authMiddleware from "../../../middlewares/auth/index.js"
import { Router } from "express"
const router = Router()

router.get("/popular/:role", getFamousUsers)
router.get("/:userId", getProfile)

router.put("/:userId/setting", authMiddleware, updateProfileSetting)

export default router
