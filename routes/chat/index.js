import express from "express"
const router = express.Router()
import { getMessagesBetweenUsers } from "../../controllers/chat/index.js"
import authMiddleware from "../../middlewares/auth/index.js"

router.get(
  "/history/:userId1/:userId2",
  authMiddleware,
  getMessagesBetweenUsers
)

export default router
