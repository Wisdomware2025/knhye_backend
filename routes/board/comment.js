import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"
import CommentController from "../../controllers/board/comment.js"
import CommentService from "../../services/board/comment.js"
import LikeService from "../../services/like/index.js"

const router = Router()

const commentController = new CommentController({
  CommentService,
  LikeService,
})

router.get("/:boardId", commentController.getAllCommentsByBoardId)
router.get("/my", authMiddleware, commentController.getAllCommentsByUserId)
router.post("/:boardId", authMiddleware, commentController.createComment)
router.put("/:id", authMiddleware, commentController.updateComment)
router.delete("/:id", authMiddleware, commentController.deleteComment)
router.post("/like/:id", authMiddleware, commentController.likeOneComment)

export default router
