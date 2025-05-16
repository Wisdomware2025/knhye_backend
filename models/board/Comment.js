import { Schema, model } from "mongoose"

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likesCnt: { type: Number, default: 0 },
  createdAt: { type: Date, required: true },
})

export default model("Comments", CommentSchema)
