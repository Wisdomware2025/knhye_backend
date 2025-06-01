import Review from "../../models/review/Review.js"
import ReviewService from "../../services/review/index.js"

const reviewService = new ReviewService({
  Review,
})

export const getReviewsByReceiverId = async (req, res) => {
  try {
    const receiverId = req.params.receiverId

    const reviews = await reviewService.getReviews(receiverId)

    res.status(200).json(reviews)
    return
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const createReview = async (req, res) => {
  try {
    const authorId = req.params.authorId
    const receiverId = req.params.receiverId

    const { role, isSatisfaction, content, image } = req.body

    const newReview = await reviewService.createReview({
      role,
      isSatisfaction,
      content,
      image,
      authorId,
      receiverId,
    })

    res.status(201).json(newReview)
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const authorId = req.params.authorId
    const { role, isSatisfaction, content, image } = req.body

    const updatedReview = await reviewService.updateReview({
      role,
      isSatisfaction,
      content,
      image,
      reviewId,
      authorId,
    })

    res.status(200).json(updatedReview)
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const authorId = req.params.authorId

    const review = await reviewService.deleteReview({ reviewId, authorId })

    if (!review) {
      res.status(404).json({ message: "리뷰를 찾을 수 없음" })
    }
    res.status(200).json({ message: "삭제 완료" })
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const likeOneReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params
    const review = await reviewService.handleLike({ userId, reviewId })

    if (!review) {
      res.status(404).json({ message: "리뷰를 찾을 수 없음" })
    }

    res.status(200).json({ message: "리뷰에 좋아요를 누름" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
