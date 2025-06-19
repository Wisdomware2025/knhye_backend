import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"
import {
  getAllCommentsByBoardId,
  getAllCommentsByUserId,
  createComment,
  updateComment,
  deleteComment,
  likeOneComment,
} from "../../controllers/board/comment.js"
const router = Router()

router.get("/:boardId", getAllCommentsByBoardId)
router.get("/my", authMiddleware, getAllCommentsByUserId)
router.post("/:boardId", authMiddleware, createComment)
router.put("/:id", authMiddleware, updateComment)
router.delete("/:id", authMiddleware, deleteComment)
router.post("/like/:id", authMiddleware, likeOneComment)

export default router
