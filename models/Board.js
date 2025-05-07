const mongoose = require("mongoose")

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 제목
  content: { type: String, required: true }, // 내용
  image: { type: String }, // 이미지
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true }, // 역할
  location: { type: String }, // 위치
  work: { type: String }, // 업무
  date: { type: Date }, // 날짜, 시간
  charge: { type: Number }, // 급여
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Board", BoardSchema)
