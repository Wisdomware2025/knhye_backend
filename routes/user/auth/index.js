import { Router } from "express"
const router = Router()
import {
  sendingAuthCode,
  signup,
  login,
} from "../../../controllers/user/auth/index.js"

router.post("/send-authcode", sendingAuthCode)
router.post("/signup", signup)
router.post("/login", login)

export default router
