import AuthService from "../../../services/user/auth/index.js"
import User from "../../../models/user/User.js"
import AuthCode from "../../../models/user/AuthCode.js"
import SendCodeService from "../../../services/user/auth/sendCode.js"
import dotenv from "dotenv"
dotenv.config()

//AuthService 의 인스턴스 생성
const authService = new AuthService({
  User,
  AuthCode,
})

const sendCodeService = new SendCodeService({
  AuthCode,
})

export const sendCode = async (req, res) => {
  const { phoneNum } = req.body

  if (!phoneNum) {
    return res.status(400).json({ message: "입력 오류" })
  }

  try {
    const isChecked = await sendCodeService.sendAligo(phoneNum)

    if (!isChecked) {
      return res.status(403).json({ message: "인증 번호 발송 실패" })
    }

    return res.status(201).json({ message: "인증번호 발송 완료" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

// 인증코드 검증
export const verifyAuthCode = async (req, res) => {
  try {
    const { phoneNum, inputCode } = req.body
    if (!phoneNum || !inputCode) {
      return res
        .status(400)
        .json({ message: "전화번호 또는 인증번호가 누락되었습니다." })
    }

    await authService.verifyAuthCode({ phoneNum, inputCode })

    return res.status(200).json({ message: "인증됨" })
  } catch (err) {
    console.error(err.message)

    return res
      .status(500)
      .json({ message: "인증 코드 확인 중 서버 오류가 발생했습니다." })
  }
}

// 회원가입
export const signup = async (req, res) => {
  try {
    const { phoneNum, username, profileImg, intro } = req.body

    if (!phoneNum || !username) {
      // 필수 필드 검증 강화
      return res
        .status(400)
        .json({ message: "필수 정보(전화번호, 사용자 이름)가 누락되었습니다." })
    }

    const newUser = await authService.signup({
      phoneNum,
      username,
      profileImg,
      intro,
    })

    return res.status(201).json({ message: "회원가입 완료", user: newUser })
  } catch (err) {
    console.error(err.message)
    return res.status(409).json({ message: err.message })
  }
}

// 로그인
export const login = async (req, res) => {
  const { phoneNum } = req.body

  if (!phoneNum) {
    return res.status(400).json({ message: "전화번호가 누락되었습니다." })
  }

  try {
    const { message, accessToken, refreshToken } = await authService.login({
      phoneNum,
    })

    // 리프레시 토큰을 HttpOnly 쿠키에 저장 => 클라이언트 JavaScript에서 접근 불가, 보안 강화
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    })

    res.status(200).json({ message, accessToken })
  } catch (err) {
    console.error(err.message)
    return res.status(401).json({ message: err.message || "로그인 실패" })
  }
}

// 자동 로그인, 액세스 토큰 갱신
export const refreshUserToken = async (req, res) => {
  // HttpOnly 쿠키에서 리프레시 토큰을 가져옴
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "리프레시 토큰이 없습니다. 다시 로그인해주세요." })
  }

  try {
    const { accessToken } = await authService.refreshUserToken(refreshToken)

    return res.status(200).json({ accessToken })
  } catch (err) {
    console.error(err.message)
    // 리프레시 토큰이 만료되었거나 유효하지 않은 경우, 쿠키를 지우고 재로그인 요청
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    return res.status(403).json({
      message: err.message || "토큰 갱신에 실패했습니다. 다시 로그인해주세요.",
    })
  }
}

// FCM 토큰 업데이트
export const updateFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body

  if (!userId || !fcmToken) {
    return res
      .status(400)
      .json({ message: "userId 또는 fcmToken이 누락되었습니다." })
  }

  try {
    const result = await authService.updateFcmToken({ userId, fcmToken })
    return res.status(200).json(result)
  } catch (err) {
    console.error(err.message)
    return res.status(err.status || 500).json({
      message: err.message || "FCM 토큰 업데이트 중 서버 오류가 발생했습니다.",
    })
  }
}

// 로그아웃
export const logout = async (req, res) => {
  // 클라이언트 측에서 액세스 토큰을 삭제, 서버 측 HttpOnly 쿠키의 리프레시 토큰을 제거
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  return res.status(200).json({ message: "로그아웃 성공" })
}
