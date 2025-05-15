import {
  sendingAuthCode,
  signup,
  login,
} from "../../../controllers/user/auth/index.js"
import { validatePhoneNum } from "../../../middlewares/auth/phoneNum.js"
import { Router } from "express"
const router = Router()

router.post("/send-authcode", sendingAuthCode)
router.post("/signup", validatePhoneNum, signup)
router.post("/login", validatePhoneNum, login)

export default router
