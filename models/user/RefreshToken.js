// models/RefreshToken.js
import mongoose from "mongoose"

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "30d" }, // 30일 후 자동 삭제
})

export default mongoose.model("RefreshToken", RefreshTokenSchema)
