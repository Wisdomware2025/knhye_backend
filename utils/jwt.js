import pkg from "jsonwebtoken"
import dotenv from "dotenv"
const { TokenExpiredError, JsonWebTokenError } = pkg

dotenv.config()

const { sign, verify } = pkg

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

// 시크릿 키가 제대로 로드되었는지 확인합니다.
// 키가 없으면 애플리케이션이 시작되지 않도록 하여 보안 문제를 방지합니다.
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error(
    "오류: JWT 시크릿 키 (ACCESS_TOKEN_SECRET 또는 REFRESH_TOKEN_SECRET)가 환경 변수에 설정되지 않았습니다."
  )
  console.error(
    "애플리케이션을 종료합니다. Cloud Run 환경 변수를 확인해주세요."
  )
  // 실제 프로덕션에서는 서버가 시작되지 않도록 프로세스를 종료하는 것이 안전합니다.
  process.exit(1)
}

export const generateTokens = (payload) => {
  // 액세스 토큰: 1시간 유효
  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  })

  // 리프레시 토큰: 30일 유효
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  })

  return { accessToken, refreshToken }
}

export const refreshAccessToken = (refreshToken) => {
  try {
    // 리프레시 토큰 검증
    const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET)

    // 새로운 액세스 토큰을 위한 페이로드 생성 (리프레시 토큰의 페이로드 활용)
    const newAccessTokenPayload = {
      userId: decoded.userId,
      username: decoded.username,
      phoneNum: decoded.phoneNum,
    }

    // 새로운 액세스 토큰 발행
    const newAccessToken = sign(newAccessTokenPayload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    })

    return newAccessToken
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("리프레시 토큰이 만료되었습니다:", error.message)
      throw new Error("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.")
    } else if (error instanceof JsonWebTokenError) {
      console.error("유효하지 않은 리프레시 토큰입니다:", error.message)
      throw new Error("유효하지 않은 리프레시 토큰입니다.")
    } else {
      console.error(
        "액세스 토큰 갱신 중 알 수 없는 오류가 발생했습니다:",
        error
      )
      throw new Error("액세스 토큰 갱신 중 알 수 없는 오류가 발생했습니다.")
    }
  }
}

export const verifyAccessToken = (token) => {
  try {
    const decoded = verify(token, ACCESS_TOKEN_SECRET)
    return decoded
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("액세스 토큰이 만료되었습니다:", error.message)
      throw new Error("액세스 토큰이 만료되었습니다.")
    } else if (error instanceof JsonWebTokenError) {
      console.error("유효하지 않은 액세스 토큰입니다:", error.message)
      throw new Error("유효하지 않은 액세스 토큰입니다.")
    } else {
      console.error(
        "액세스 토큰 검증 중 알 수 없는 오류가 발생했습니다:",
        error
      )
      throw new Error("액세스 토큰 검증 중 알 수 없는 오류가 발생했습니다.")
    }
  }
}
