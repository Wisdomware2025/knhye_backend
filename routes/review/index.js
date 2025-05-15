import {
  getReviewsByReceiverId,
  createReview,
  updateReview,
  deleteReview,
} from "../../controllers/review/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateReview } from "../../middlewares/review"
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

export default router
