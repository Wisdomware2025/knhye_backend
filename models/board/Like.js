import { Schema, model } from "mongoose"

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
})

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true }) // 중복 방지

export default model("Likes", LikeSchema)
