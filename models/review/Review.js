import { Schema, model } from "mongoose"

const ReviewSchema = new Schema({
  //true : 농부, false : 근로자
  role: { type: Boolean, required: true, default: true },
  isSatisfaction: { type: Boolean, required: true, default: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likesCnt: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default model("Review", ReviewSchema)
