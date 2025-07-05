import express from "express"
const router = express.Router()
import {
  getChatList,
  getMessagesBetweenUsers,
  markMessagesAsRead,
  sendMessageToOther,
} from "../../controllers/chat/index.js"
import authMiddleware from "../../middlewares/auth/index.js"

router.get("/list", authMiddleware, getChatList)
router.post("/send-message/:receiverId", authMiddleware, sendMessageToOther)
router.get("/history/:user", authMiddleware, getMessagesBetweenUsers)
router.post("/read/:user", authMiddleware, markMessagesAsRead)

export default router
