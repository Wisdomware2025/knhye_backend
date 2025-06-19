import {
  verifyAuthCode,
  signup,
  login,
  sendCode,
  refreshUserToken,
  updateFcmToken,
  logout,
} from "../../../controllers/user/auth/index.js"
import { validatePhoneNum } from "../../../middlewares/auth/phoneNum.js"
import authMiddleware from "../../../middlewares/auth/index.js"

import { Router } from "express"

const router = Router()

router.post("/send-code", validatePhoneNum, sendCode)
router.post("/code-check", verifyAuthCode)
router.post("/signup", signup)
router.post("/login", login)
router.post("/auto-login", refreshUserToken)
router.post("/get-fcmToken", authMiddleware, updateFcmToken)
router.post("/logout", authMiddleware, logout)

export default router
