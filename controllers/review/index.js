import Review from "../../models/review/Review"
import ReviewService from "../../services/review"

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

    const data = req.body

    const newReview = await reviewService.createReview({
      data,
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
    const data = req.body

    const updatedReview = await reviewService.updateReview({
      data,
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

    await reviewService.deleteReview({ reviewId, authorId })
    res.status(200).json({ message: "삭제 완료" })
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}
