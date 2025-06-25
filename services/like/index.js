import mongoose from "mongoose"

const MAX_RETRY_ATTEMPTS = 2

class LikeService {
  constructor({ Like, Board, Review, Comment }) {
    this.Like = Like
    this.Board = Board
    this.Review = Review
    this.Comment = Comment
  }

  // async likeNotification({likeId, type}){
  //   try{
  //     //like : userId, boardId
  //     //board : author(userId)

  //     //board의 author은 receiver
  //     //like를 찾아서 userId를 populate
  //     //author에게 "userId님이 회원님의 --에 좋아요를 눌렀습니다."전송

  //     const likeEntry = await this.Like.findById(likeId).populate("userId")

  //     if(!likeEntry){
  //       throw new Error("좋아요가 눌러져있지 않습니다.")
  //     }

  //     const userFcmTokens = likeEntry.userId.fcmToken
  //     if(!userFcmTokens) {

  //       console.warn(
  //         `사용자의 FCM 토큰이 존재하지 않습니다.`
  //       )
  //       return
  //     }

  //     const title = "[일손(ilson)] 알림"
  //     const body = `${likeEntry.userId}님이 회원님의 ${type}에 좋아요를 눌렀습니다.`
  //   }
  // }

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
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, boardId }], { session })
          await this.Board.updateOne(
            { _id: boardId },
            { $inc: { likesCnt: 1 } }
          ).session(session)
        }
      })

      return this.Board.likesCnt
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
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, reviewId }], { session })
          await this.Review.updateOne(
            { _id: reviewId },
            { $inc: { likesCnt: 1 } }
          ).session(session)
        }
      })

      return this.Review.likesCnt
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

  async toggleLikeComment({ userId, commentId }) {
    if (typeof commentId === "object" && commentId.commentId) {
      commentId = commentId.commentId
    }
    const session = await mongoose.startSession()

    try {
      await session.withTransaction(async () => {
        const existingLike = await this.Like.findOne({
          userId,
          commentId,
        }).session(session)

        if (existingLike) {
          // 좋아요 취소
          await this.Like.deleteOne({ _id: existingLike._id }).session(session)
          await this.Comment.updateOne(
            { _id: commentId },
            { $inc: { likesCnt: -1 } }
          ).session(session)
        } else {
          // 좋아요 추가
          await this.Like.create([{ userId, commentId }], { session })
          await this.Comment.updateOne(
            { _id: reviewId },
            { $inc: { likesCnt: 1 } }
          ).session(session)
        }
      })

      return this.Comment.likesCnt
    } catch (err) {
      if (err.code === 11000) {
        console.warn(
          `Duplicate key error (E11000) for userId: ${userId}, commentId: ${commentId}.`,
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
