import { Schema, model } from "mongoose"

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: Schema.Types.ObjectId, ref: "Board" },
  reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
})

// 중복 방지는 개별적으로 설정해야함
LikeSchema.index(
  { userId: 1, boardId: 1 },
  { unique: true, partialFilterExpression: { boardId: { $exists: true } } }
)
LikeSchema.index(
  { userId: 1, reviewId: 1 },
  { unique: true, partialFilterExpression: { reviewId: { $exists: true } } }
)

export default model("Like", LikeSchema)
