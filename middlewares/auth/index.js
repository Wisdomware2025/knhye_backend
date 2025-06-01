import jwt from "jsonwebtoken"

const { verify } = jwt

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")

  // Authorization 헤더 확인
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "인증 실패.",
    })
  }
  let decoded

  try {
    // Bearer 제거 후 토큰 추출
    const actualToken = token.split(" ")[1]

    // 토큰 검증
    decoded = verify(actualToken, process.env.JWT_SECRET)
  } catch (error) {
    res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
      error: error.message,
    })
  }

  // 사용자 정보 요청 객체에 저장
  req.user = decoded
  next()
}

export default authMiddleware
