import AuthService from "../../../services/user/auth/index.js"
import User from "../../../models/User.js"
import AuthCode from "../../../models/AuthCode.js"

//AuthService 의 인스턴스 생성
const authService = new AuthService({
  User,
  AuthCode,
  AuthService,
})

// 인증번호 발송
export const sendingAuthCode = async (req, res) => {
  const { phoneNum, country } = req.body
  if (!phoneNum || !country) {
    return res.status(400).json({ message: "전화번호와 국적을 입력하세요" })
  }

  try {
    const isSent = await authService.callSendAuthCode(phoneNum)
    if (isSent) {
      return res.json({ message: "인증번호 발송 완료" })
    } else {
      return res.status(500).json({ message: "인증번호 발송 실패" })
    }
  } catch (error) {
    console.error("인증번호 발송 중 오류:", error)
    return res.status(500).json({ message: "서버 오류" })
  }
}

// 회원가입
export const signup = async (req, res) => {
  const { country, phoneNum, inputCode, username, profileImg, intro } = req.body

  if (!req.body) {
    return res.status(400).json({ message: "입력 오류" })
  }

  try {
    // 회원가입 : User 생성
    const newUser = await authService.signup({
      country,
      phoneNum,
      inputCode,
      username,
      profileImg,
      intro,
    })
    return res.status(201).json({ message: "회원가입 완료", user: newUser })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const login = async (req, res) => {
  const { phoneNum, inputCode } = req.body

  if (!phoneNum || !inputCode) {
    return res.status(400).json({ error: "전화번호, 인증코드 확인" })
  }

  try {
    //의존성 사용
    const result = await authService.login({ phoneNum, inputCode })
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "인증 실패" })
  }
}
