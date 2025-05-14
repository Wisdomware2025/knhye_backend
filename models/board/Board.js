import { Schema, model } from "mongoose"

const BoardSchema = new Schema({
  title: { type: String, required: true }, // 제목
  content: { type: String, required: true }, // 내용
  image: { type: String }, // 이미지
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true }, // 역할
  location: { type: String }, // 위치
  work: { type: String }, // 업무
  date: { type: Date }, // 날짜, 시간
  charge: { type: Number }, // 급여
  isSelected: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
})

export default model("Board", BoardSchema)
