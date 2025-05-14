import { Router } from "express"
const router = Router()
import {
  sendingAuthCode,
  signup,
  login,
} from "../../../controllers/user/auth/index.js"
import { validatePhoneNum } from "../../../middlewares/auth/phoneNum.js"

router.post("/send-authcode", sendingAuthCode)
router.post("/signup", validatePhoneNum, signup)
router.post("/login", validatePhoneNum, login)

export default router
