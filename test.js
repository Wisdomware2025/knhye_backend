import { generateTokens } from "./utils/jwt.js" // 파일 경로 변경
import dotenv from "dotenv"
dotenv.config()

const id = new mongoose.Types.ObjectId("683cff894e29c4d01920a301")

const payload = {
  userId: id,
  username: "nahye",
  phoneNum: "01047013432",
}

// 토큰 생성
const { accessToken, refreshToken } = generateTokens(payload)

console.log("Access Token:", accessToken)
console.log("Refresh Token:", refreshToken)
