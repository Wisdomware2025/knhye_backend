import Review from "../../models/review/Review.js"

async function checkReviewAndAuthor(reviewId, authorId) {
  const review = await Review.findById(reviewId)

  if (!review) {
    throw { status: 404, message: "리뷰가 없습니다." }
  }

  if (review.author.toString() !== authorId) {
    throw { status: 403, message: "권한이 없습니다." }
  }

  return review
}

class ReviewService {
  constructor({ Review }) {
    this.Review = Review
  }

  async getReviews(receiverId) {
    return await this.Review.find({ receiver: receiverId })
  }

  async createReview(data, authorId, receiverId) {
    const review = new this.Review({
      data,
      author: authorId,
      receiver: receiverId,
    })

    return review.save()
  }

  async updateReview({ reviewId, data, authorId }) {
    const review = await checkReviewAndAuthor(reviewId, authorId)

    review.set({
      ...data,
    })

    return await review.save()
  }

  async deleteReview({ reviewId, authorId }) {
    const review = await checkReviewAndAuthor(reviewId, authorId)

    return await review.deleteOne()
  }
}

export default ReviewService
