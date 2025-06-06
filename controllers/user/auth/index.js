import AuthService from "../../../services/user/auth/index.js"
import User from "../../../models/user/User.js"
import AuthCode from "../../../models/user/AuthCode.js"
import SendCodeService from "../../../services/user/auth/sendCode.js"

//AuthService 의 인스턴스 생성
const authService = new AuthService({
  User,
  AuthCode,
})

const sendCodeService = new SendCodeService({
  AuthCode,
})

export const sendCode = async (req, res) => {
  const { country, phoneNum } = req.body

  if (!phoneNum || !country) {
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

export const signup = async (req, res) => {
  try {
    const { country, phoneNum, inputCode, username, profileImg, intro } =
      req.body

    if (!phoneNum || !inputCode) {
      return res
        .status(400)
        .json({ message: "전화번호 또는 인증번호가 누락되었습니다" })
    }
    const newUser = await authService.signup({
      country,
      phoneNum,
      inputCode,
      username,
      profileImg,
      intro,
    })

    if (!newUser) {
      return res.status(400).json({ message: "회원가입에 실패했습니다" })
    }
    return res.status(201).json({ message: "회원가입 완료", user: newUser })
  } catch (err) {
    return res.status(err.status || 500).json({ message: err })
  }
}

export const login = async (req, res) => {
  const { phoneNum, inputCode } = req.body

  if (!phoneNum || !inputCode) {
    return res.status(400).json({ error: "전화번호, 인증코드 확인" })
  }

  try {
    const result = await authService.login({ phoneNum, inputCode })
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "인증 실패" })
  }
}
