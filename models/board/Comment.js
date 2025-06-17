import { Schema, model } from "mongoose"

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  content: { type: String, required: true },
  likesCnt: { type: Number, default: 0 },
  createdAt: { type: Date, required: true },
})

export default model("Comments", CommentSchema)
