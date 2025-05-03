import pkg from "jsonwebtoken"
const { sign, verify } = pkg
const secretKey = process.env.JWT_SECRET_KEY

//토큰 발행
const generateToken = (payload) => {
  const token = sign(payload, secretKey, { expiresIn: "1h" })

  return token
}

// 새로운 토큰 생성 함수
const refreshToken = (token) => {
  try {
    // 기존 토큰의 유효성 검사 및 디코딩
    const decoded = verify(token, secretKey)

    // 새로운 페이로드 생성
    const payload = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    }

    // 새로운 토큰 생성
    const newToken = generateToken(payload)
    return newToken
  } catch (error) {
    // 토큰 새로 고침 중 오류 발생 시 출력
    console.error("Error refreshing token:", error)
    return null
  }
}

export default { generateToken, refreshToken }
