import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"
import {
  addNewFriend,
  getFriendsCnt,
  removeFriend,
} from "../../controllers/friend"
const router = Router()

router.post("/:userId/:friendId", authMiddleware, addNewFriend)
router.delete("/:userId/:friendId", authMiddleware, removeFriend)
router.get("/:userId", authMiddleware, getFriendsCnt)
