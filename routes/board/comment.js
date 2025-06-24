import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"
import CommentController from "../../controllers/board/comment.js"
const router = Router()

router.get("/:boardId", CommentController.getAllCommentsByBoardId)
router.get("/my", authMiddleware, CommentController.getAllCommentsByUserId)
router.post("/:boardId", authMiddleware, CommentController.createComment)
router.put("/:id", authMiddleware, CommentController.updateComment)
router.delete("/:id", authMiddleware, CommentController.deleteComment)
router.post("/like/:id", authMiddleware, CommentController.likeOneComment)

export default router
