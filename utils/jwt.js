import pkg from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const { sign, verify } = pkg

// 환경 변수에서 시크릿 키를 가져옵니다. 보안상 별도의 키를 사용하는 것이 좋습니다.
const accessSecretToken = process.env.ACCESS_TOKEN_SECRET
const refreshSecretToken = process.env.REFRESH_TOKEN_SECRET

// 액세스 토큰과 리프레시 토큰을 동시에 발행하는 함수
export const generateTokens = (payload) => {
  // 액세스 토큰: 1시간
  const accessSecretToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  })
  // 리프레시 토큰: 30일
  const refreshSecretToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  })

  return { accessSecretToken, refreshSecretToken }
}

// 리프레시 토큰을 검증하고 새로운 액세스 토큰을 발행하는 함수
export const refreshAccessToken = (refreshToken) => {
  try {
    // 리프레시 토큰 검증
    const decoded = verify(refreshToken, refreshSecretToken)

    // 새로운 액세스 토큰을 위한 페이로드 생성 (리프레시 토큰의 페이로드 활용)
    const newAccessTokenPayload = {
      userId: decoded.userId,
      username: decoded.username,
      phoneNum: decoded.phoneNum,
    }

    // 새로운 액세스 토큰 발행
    const newAccessToken = sign(newAccessTokenPayload, accessSecretToken, {
      expiresIn: "1h",
    })

    return newAccessToken
  } catch (error) {
    // 리프레시 토큰이 유효하지 않거나 만료된 경우
    console.error("Error refreshing access token:", error)
    // 에러를 던져서 상위 로직에서 적절히 처리할 수 있도록 합니다.
    throw new Error("유효하지 않거나 만료된 토큰입니다.")
  }
}

// 액세스 토큰 검증 함수 (미들웨어 등에서 사용)
export const verifyAccessToken = (token) => {
  try {
    const decoded = verify(token, accessSecretToken)
    return decoded
  } catch (error) {
    console.error("Error verifying access token:", error)
    throw new Error("유효하지 않거나 만료된 액세스 토큰입니다.")
  }
}
