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
router.post("/:receiverId", authMiddleware, validateReview, createReview)
router.put("/:reviewId", authMiddleware, validateReview, updateReview)
router.delete("/:reviewId", authMiddleware, deleteReview)
router.post("/likes/:reviewId", authMiddleware, likeOneReview)

export default router
