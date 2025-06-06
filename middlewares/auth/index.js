import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const { verify } = jwt

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")

  // Authorization 헤더 확인
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "인증 실패: 토큰이 존재하지 않거나 형식이 잘못되었습니다.",
    })
  }

  try {
    // Bearer 제거 후 토큰 추출
    const actualToken = token.split(" ")[1]

    // 토큰 검증
    const decoded = verify(actualToken, process.env.JWT_SECRET_KEY)

    // 사용자 정보 요청 객체에 저장
    req.user = decoded

    // 다음 미들웨어로 진행
    next()
  } catch (error) {
    // 검증 실패
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
      error: error.message,
    })
  }
}

export default authMiddleware
