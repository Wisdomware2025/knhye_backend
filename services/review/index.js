async function checkReviewAndAuthor({ reviewId, authorId }) {
  const review = await this.Review.findOne({ _id: "684b7d23403d0e1d85ec0f00" })

  if (!review) {
    throw { status: 404, message: "리뷰가 없습니다." }
  }

  if (review.author.toString() !== authorId) {
    throw { status: 403, message: "권한이 없습니다." }
  }

  return review
}

class ReviewService {
  constructor({ Review, LikeService }) {
    this.Review = Review
    this.LikeService = LikeService
    this.checkReviewAndAuthor = checkReviewAndAuthor
  }

  async getReviews(receiverId) {
    return await this.Review.find({ receiver: receiverId })
  }

  async createReview(data) {
    const review = new this.Review(data)

    return await review.save()
  }

  async updateReview({ data, authorId, reviewId }) {
    const review = await this.checkReviewAndAuthor({ reviewId, authorId })

    review.set({ ...data })

    return await review.save()
  }

  async deleteReview({ reviewId, authorId }) {
    const review = await this.checkReviewAndAuthor({ reviewId, authorId })

    return await review.deleteOne()
  }
}

export default ReviewService
