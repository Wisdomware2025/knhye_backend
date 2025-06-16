import mongoose from "mongoose"

class LikeService {
  constructor({ Like, Board, Review }) {
    this.Like = Like
    this.Board = Board
    this.Review = Review
  }

  async toggleLikeBoard({ userId, boardId }) {
    const session = await mongoose.startSession()

    try {
      let responseMessage = ""
      await session.withTransaction(async () => {
        const existingLike = await this.Like.findOne({
          userId,
          boardId,
        }).session(session)

        if (existingLike) {
          // 좋아요 취소
          await this.Like.deleteOne({ _id: existingLike._id }).session(session)
          await this.Board.updateOne(
            { _id: boardId },
            { $inc: { likesCnt: -1 } }
          ).session(session)

          responseMessage = "좋아요 취소됨"
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, boardId }], { session })
          await this.Board.updateOne(
            { _id: boardId },
            { $inc: { likesCnt: 1 } }
          ).session(session)

          responseMessage = "좋아요 등록됨"
        }
      })

      return { success: true, message: responseMessage }
    } catch (err) {
      if (err.code === 11000) {
        console.warn(
          `Duplicate key error (E11000) for userId: ${userId}, boardId: ${boardId}.`,
          err
        )
      }
      throw err
    } finally {
      session.endSession()
    }
  }

  async toggleLikeReview({ userId, reviewId }) {
    // reviewId 값만 꺼냄
    if (typeof reviewId === "object" && reviewId.reviewId) {
      reviewId = reviewId.reviewId
    }
    const session = await mongoose.startSession()

    try {
      let message
      await session.withTransaction(async () => {
        const existingLike = await this.Like.findOne({
          userId,
          reviewId,
        }).session(session)

        if (existingLike) {
          // 좋아요 취소
          await this.Like.deleteOne({ _id: existingLike._id }).session(session)
          await this.Review.updateOne(
            { _id: reviewId },
            { $inc: { likesCnt: -1 } }
          ).session(session)

          message = "리뷰 좋아요 취소됨"
          return { liked: false }
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, reviewId }], { session })
          await this.Review.updateOne(
            { _id: reviewId },
            { $inc: { likesCnt: 1 } }
          ).session(session)

          message = "리뷰 좋아요 등록됨"
          return { liked: true }
        }
      })

      return { message: message }
    } catch (err) {
      if (err.code === 11000) {
        console.warn(
          `Duplicate key error (E11000) for userId: ${userId}, reviewId: ${reviewId}.`,
          err
        )
      }
      throw err
    } finally {
      session.endSession()
    }
  }
}

export default LikeService
