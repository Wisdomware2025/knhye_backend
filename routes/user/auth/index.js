import {
  signup,
  login,
  sendCode,
} from "../../../controllers/user/auth/index.js"
import { validatePhoneNum } from "../../../middlewares/auth/phoneNum.js"

import { Router } from "express"
const router = Router()

router.post("/send-code", validatePhoneNum, sendCode)
router.post("/signup", signup)
router.post("/login", login)

export default router
