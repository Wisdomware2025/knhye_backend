import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriends,
  getFriendsCnt,
} from "../../../controllers/user/friend/index.js"
import authMiddleware from "../../../middlewares/auth/index.js"
import { Router } from "express"
const router = Router()

// 친구 요청
router.post("/request", authMiddleware, sendFriendRequest)

// 친구 요청 수락
router.post("/accept", authMiddleware, acceptFriendRequest)
router.delete("/:userId/:friendId", authMiddleware, removeFriends)
router.get("/:userId", getFriendsCnt)

export default router
