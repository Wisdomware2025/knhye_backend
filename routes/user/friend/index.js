import {
  addFriends,
  removeFriends,
  getFriendsCnt,
} from "../../../controllers/user/friend"
import authMiddleware from "../../../middlewares/auth"
import { Router } from "express"
const router = Router()

router.post("/:userId/:friendId", authMiddleware, addFriends)
router.delete("/:userId/:friendId", authMiddleware, removeFriends)
router.get("/:userId", authMiddleware, getFriendsCnt)

export default router
