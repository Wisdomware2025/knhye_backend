import Review from "../../models/review/Review.js"
import LikeService from "../../services/like/index.js"
import ReviewService from "../../services/review/index.js"
import Like from "../../models/like/Like.js"
import { sendNotification } from "../../firebase/fcm.js"
const reviewService = new ReviewService({
  Review,
})

const likeService = new LikeService({
  Like,
  Review,
  sendNotification,
})

export const getReviewsByReceiverId = async (req, res) => {
  try {
    const receiverId = req.params.receiverId

    const reviews = await reviewService.getReviews(receiverId)

    return res.status(200).json(reviews)
  } catch (err) {
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const createReview = async (req, res) => {
  try {
    const data = {
      role: req.body.role,
      isSatisfaction: req.body.isSatisfaction,
      content: req.body.content,
      image: req.body.image,
      author: req.user.userId,
      authorName: req.user.username,
      receiver: req.params.receiverId,
      likesCnt: req.body.likesCnt,
    }

    const newReview = await reviewService.createReview(data)

    return res.status(201).json(newReview)
  } catch (err) {
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const updateReview = async (req, res) => {
  try {
    const data = {
      ...req.body,
    }

    const reviewId = req.params.reviewId
    const authorId = req.user.userId

    const updatedReview = await reviewService.updateReview({
      data,
      reviewId,
      authorId,
    })

    return res.status(200).json(updatedReview)
  } catch (err) {
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const authorId = req.user.userId

    const review = await reviewService.deleteReview({ reviewId, authorId })

    if (!review) {
      res.status(404).json({ message: "리뷰를 찾을 수 없음" })
    }
    return res.status(200).json({ message: "삭제 완료" })
  } catch (err) {
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const likeOneReview = async (req, res) => {
  try {
    const reviewId = req.params
    const userId = req.user.userId
    const review = await likeService.toggleLikeReview({ userId, reviewId })

    if (!review) {
      res.status(404).json({ message: "리뷰를 찾을 수 없음" })
    }

    return res.json(review)
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
