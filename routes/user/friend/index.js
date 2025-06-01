import {
  addFriends,
  removeFriends,
  getFriendsCnt,
} from "../../../controllers/user/friend/index.js"
import authMiddleware from "../../../middlewares/auth/index.js"
import { Router } from "express"
const router = Router()

router.post("/:userId/:friendId", authMiddleware, addFriends)
router.delete("/:userId/:friendId", authMiddleware, removeFriends)
router.get("/:userId", getFriendsCnt)

export default router
