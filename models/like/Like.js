import { Schema, model } from "mongoose"

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: Schema.Types.ObjectId, ref: "Board" },
  reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
})

export default model("Like", LikeSchema)
