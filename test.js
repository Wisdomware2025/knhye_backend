import { generateTokens, verifyAccessToken } from "./utils/jwt.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

const id = new mongoose.Types.ObjectId("686e23a8553f2c138eeb5e57")

const payload = {
  userId: id,
  username: "용띠",
  phoneNum: "01048492384",
}

// 토큰 생성
const { accessToken, refreshToken } = generateTokens(payload)

console.log("Access Token:", accessToken)
console.log("Refresh Token:", refreshToken)

try {
  const decoded = verifyAccessToken(accessToken)
  console.log("Access Token verified successfully locally:", decoded)
} catch (error) {
  console.error("Local Access Token verification failed:", error.message)
  // 여기서 '유효하지 않은 액세스 토큰입니다' 또는 '액세스 토큰이 만료되었습니다'가 뜨는지 확인
}
