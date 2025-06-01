import {
  getReviewsByReceiverId,
  createReview,
  updateReview,
  deleteReview,
  likeOneReview,
} from "../../controllers/review/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateReview } from "../../middlewares/review/index.js"
import { Router } from "express"

const router = Router()

router.get("/:receiverId", getReviewsByReceiverId)
router.post(
  "/:authorId/:receiverId",
  authMiddleware,
  validateReview,
  createReview
)
router.put("/:authorId/:reviewId", authMiddleware, validateReview, updateReview)
router.delete("/:authorId/:reviewId", authMiddleware, deleteReview)
router.post("/:reviewId/:userId", authMiddleware, likeOneReview)

export default router
