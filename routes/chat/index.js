import express from "express"
const router = express.Router()
import {
  getMessagesBetweenUsers,
  sendMessageToOther,
} from "../../controllers/chat/index.js"
import authMiddleware from "../../middlewares/auth/index.js"

router.post("/send-message/:receiverId", authMiddleware, sendMessageToOther)
router.get("/history/:user", authMiddleware, getMessagesBetweenUsers)

export default router
