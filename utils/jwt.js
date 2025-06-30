import pkg from "jsonwebtoken"
import dotenv from "dotenv"
const { TokenExpiredError, JsonWebTokenError } = pkg
import RefreshToken from "../models/user/RefreshToken.js"
import User from "../models/user/User.js"

dotenv.config()

const { sign, verify } = pkg

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

// 시크릿 키가 제대로 로드되었는지 확인합니다.
// 키가 없으면 애플리케이션이 시작되지 않도록 하여 보안 문제를 방지합니다.
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  // 실제 프로덕션에서는 서버가 시작되지 않도록 프로세스를 종료하는 것이 안전합니다.
  process.exit(1)
}

export const generateTokens = (payload) => {
  // 액세스 토큰: 1일
  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  })

  // 리프레시 토큰: 30일 유효
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  })

  return { accessToken, refreshToken }
}

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("리프레시 토큰이 제공되지 않았습니다.")

  try {
    // 리프레시 토큰 검증
    const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    // DB에 저장된 토큰인지 확인 (블랙리스트 확인 효과)
    const savedToken = await RefreshToken.findOne({ token: refreshToken })
    if (!savedToken) {
      throw new Error("유효하지 않거나 만료된 리프레시 토큰입니다.")
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다. 다시 로그인해주세요.")
    }

    // 새로운 액세스 토큰 생성
    const newAccessTokenPayload = {
      userId: decoded.userId,
      username: decoded.username,
      phoneNum: decoded.phoneNum,
    }

    const newAccessToken = sign(
      newAccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    )

    // 새로운 리프레시 토큰 발행
    const newRefreshToken = sign(
      newAccessTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    )

    // 기존 리프레시 토큰 삭제 후 새로 저장
    await RefreshToken.deleteMany({ userId: decoded.userId })
    await RefreshToken.create({
      userId: decoded.userId,
      token: newRefreshToken,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: decoded.userId,
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.")
    } else if (error instanceof JsonWebTokenError) {
      throw new Error("유효하지 않은 리프레시 토큰입니다.")
    } else {
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
      throw new Error("액세스 토큰이 만료되었습니다.")
    } else if (error instanceof JsonWebTokenError) {
      throw new Error("유효하지 않은 액세스 토큰입니다.")
    } else {
      throw new Error("액세스 토큰 검증 중 알 수 없는 오류가 발생했습니다.")
    }
  }
}
