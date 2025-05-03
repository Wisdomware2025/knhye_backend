import AuthService from "../../services/auth/index.js"
import User from "../../models/User.js"
import AuthCode from "../../models/AuthCode.js"
import authCodeService from "../../services/auth/authCode.js"

//AuthService 의 인스턴스 생성
const authService = new AuthService({
  User,
  AuthCode,
  authCodeService,
})

//전화번호 => 인증 번호 발송  / 인증번호 입력 => 로그인 처리는
// 시간차가 있는 서로 다른 요청 => 하나에 다 넣으면 꼬임

export const sendCode = async (req, res) => {
  const { phoneNum } = req.body
  if (!phoneNum) {
    return res.status(400).json({ message: "전화번호를 입력하세요" })
  }

  try {
    const isSent = await authService.sendAuthCode(phoneNum)
    if (isSent) {
      return res.status(200).json({ message: "인증번호 전송 완료" })
    } else {
      return res.status(500).json({ message: "인증번호 전송 실패" })
    }
  } catch (error) {
    console.error("인증번호 전송 오류:", error)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const signup = async (req, res) => {
  const { phoneNum, inputCode, username, profileImg, intro } = req.body

  if (!phoneNum || !inputCode || !username) {
    return res.status(400).json({ message: "필수 입력값 누락" })
  }

  try {
    // 1. 인증번호 검증
    const isCodeValid = await authService.verifyCode(phoneNum, inputCode)
    if (!isCodeValid) {
      return res.status(401).json({ message: "인증번호가 일치하지 않습니다" })
    }

    // 2. 회원가입 처리
    const newUser = await authService.signup({
      phoneNum,
      username,
      profileImg,
      intro,
    })

    return res.status(201).json({ message: "회원가입 성공", user: newUser })
  } catch (err) {
    console.error("회원가입 오류:", err)
    return res.status(500).json({ message: "서버 오류", error: err.message })
  }
}

export const login = async (req, res) => {
  const { phoneNum, inputCode } = req.body

  if (!phoneNum || !inputCode) {
    return res.status(400).json({ error: "전화번호, 인증번호 입력 확인" })
  }

  try {
    const isCodeValid = await authService.verifyCode(phoneNum, inputCode)
    if (!isCodeValid) {
      return res.status(401).json({ error: "인증번호 불일치" })
    }

    const result = await authService.loginWithPhone(phoneNum)
    return res.status(200).json(result)
  } catch (err) {
    console.error("로그인 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
}
