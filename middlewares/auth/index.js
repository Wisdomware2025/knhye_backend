const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")

  // Authorization 헤더 확인
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "인증 실패.",
    })
  }

  try {
    // Bearer 제거 후 토큰 추출
    const actualToken = token.split(" ")[1]

    // 토큰 검증
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET)

    // 사용자 정보 요청 객체에 저장
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
      error: error.message,
    })
  }
}

module.exports = authMiddleware
