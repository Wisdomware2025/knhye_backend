import { Schema, model } from "mongoose"

const ReviewSchema = new Schema({
  role: { type: String, required: true },
  isSatisfaction: { type: Boolean, required: true, default: true },
  content: { type: String, required: true },
  image: {
    type: [String],
    default: [],
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likesCnt: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default model("Review", ReviewSchema)
