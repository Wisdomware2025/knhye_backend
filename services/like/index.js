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

          return { liked: false, message: "좋아요 취소됨" }
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, boardId }], { session })
          await this.Board.updateOne(
            { _id: boardId },
            { $inc: { likesCnt: 1 } }
          ).session(session)

          return { liked: true, message: "좋아요 등록됨" }
        }
      })

      return { success: true }
    } catch (err) {
      await session.abortTransaction()
      if (err.code === 11000) {
        throw { status: 400, message: "중복된 좋아요입니다." }
      }
      throw err
    } finally {
      session.endSession()
    }
  }

  async toggleLikeReview({ userId, reviewId }) {
    const session = await mongoose.startSession()

    try {
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

          return { liked: false, message: "리뷰 좋아요 취소됨" }
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, reviewId }], { session })
          await this.Review.updateOne(
            { _id: reviewId },
            { $inc: { likesCnt: 1 } }
          ).session(session)

          return { liked: true, message: "리뷰 좋아요 등록됨" }
        }
      })

      return { success: true }
    } catch (err) {
      await session.abortTransaction()
      if (err.code === 11000) {
        throw { status: 400, message: "중복된 좋아요입니다." }
      }
      throw err
    } finally {
      session.endSession()
    }
  }
}

export default LikeService
