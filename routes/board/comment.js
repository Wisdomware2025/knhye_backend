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

// GET
router.get("/:boardId", (req, res) =>
  commentController.getAllCommentsByBoardId(req, res)
)
router.get("/my", authMiddleware, (req, res) =>
  commentController.getAllCommentsByUserId(req, res)
)

// POST
router.post("/:boardId", authMiddleware, (req, res) =>
  commentController.createComment(req, res)
)

// PUT
router.put("/:id", authMiddleware, (req, res) =>
  commentController.updateComment(req, res)
)

// DELETE
router.delete("/:id", authMiddleware, (req, res) =>
  commentController.deleteComment(req, res)
)

// POST like
router.post("/like/:id", authMiddleware, (req, res) =>
  commentController.likeOneComment(req, res)
)

export default router
