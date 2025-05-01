const authService = require("../../services/auth")

// 인증번호 발송
exports.sendAuthCode = async (req, res) => {
  const { phoneNum } = req.body
  if (!phoneNum) {
    return res.status(400).json({ message: "전화번호가 필요합니다" })
  }

  try {
    const isSent = await authService.sendAuthCode(phoneNum)
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
exports.signup = async (req, res) => {
  const { country, phoneNum, inputCode, username, profileImg, intro } = req.body

  if (!req.body) {
    return res.status(400).json({ message: "입력 오류" })
  }

  try {
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
    return res.status(500).json({ message: "서버 오류", error: err.message })
  }
}
