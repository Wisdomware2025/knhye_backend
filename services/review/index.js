class ReviewService {
  constructor({ Review, LikeService }) {
    this.Review = Review
    this.LikeService = LikeService
  }

  async checkReviewAndAuthor(reviewId, authorId) {
    const review = await this.Review.findById(reviewId)

    if (!review) {
      throw { status: 404, message: "리뷰가 없습니다." }
    }

    if (review.author.toString() !== authorId) {
      throw { status: 403, message: "권한이 없습니다." }
    }

    return review
  }

  async getReviews(receiverId) {
    return await this.Review.find({ receiver: receiverId })
  }

  async createReview(
    role,
    isSatisfaction,
    content,
    image,
    authorId,
    receiverId
  ) {
    const review = new this.Review({
      role,
      isSatisfaction,
      content,
      image,
      author: authorId,
      receiver: receiverId,
    })

    return review.save()
  }

  async updateReview({
    reviewId,
    role,
    isSatisfaction,
    content,
    image,
    authorId,
  }) {
    const review = await checkReviewAndAuthor(reviewId, authorId)

    review.set({
      role,
      isSatisfaction,
      content,
      image,
    })

    return await review.save()
  }

  async deleteReview({ reviewId, authorId }) {
    const review = await checkReviewAndAuthor(reviewId, authorId)

    return await review.deleteOne()
  }

  async handleLike({ userId, reviewId }) {
    return await this.LikeService.toggleLikeReview({ userId, reviewId })
  }
}

export default ReviewService
