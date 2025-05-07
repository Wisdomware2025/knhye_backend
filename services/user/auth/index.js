class AuthService {
  constructor({ User, AuthCode, generateToken, AuthCodeService }) {
    this.User = User
    this.AuthCode = AuthCode
    this.generateToken = generateToken
    this.AuthCodeService = AuthCodeService
  }

  // 인증 코드 전송
  async callSendAuthCode(phoneNum) {
    try {
      // AuthCodeService의 sendAuthCode 호출
      const isSent = await this.AuthCodeService.sendAuthCode(phoneNum)
      return isSent
    } catch (err) {
      console.error("인증번호 발송 실패:", err)
      throw new Error("인증번호 발송 실패")
    }
  }

  // 인증코드 검증하는 로직
  async verifyAuthCode(phoneNum, inputCode) {
    try {
      const storedAuthCode = await this.AuthCode.findOne({
        phone_number: phoneNum,
      }).sort({ createdAt: -1 })

      if (!storedAuthCode || new Date() > storedAuthCode.expiration_time) {
        await this.AuthCode.deleteMany({ phone_number: phoneNum }) // 만료된 인증코드 삭제
        throw new Error("인증 코드가 만료되었거나 존재하지 않습니다.")
      }
      if (inputCode !== storedAuthCode.auth_code) {
        throw new Error("인증 코드가 잘못되었습니다.")
      }

      // 인증 성공 후 관련 인증코드 모두 삭제
      await this.AuthCode.deleteMany({ phone_number: phoneNum })
      return true
    } catch (err) {
      throw err
    }
  }

  // 회원가입 서비스
  async signup({ country, phoneNum, inputCode, username, profileImg, intro }) {
    try {
      await this.verifyAuthCode(phoneNum, inputCode)
      const newUser = await this.User.create({
        country,
        phoneNum,
        username,
        profileImg,
        intro,
      })
      return newUser
    } catch (err) {
      throw new Error(err.message || "회원가입 중 오류 발생")
    }
  }

  // 로그인 서비스
  async login({ phoneNum, inputCode }) {
    try {
      await this.verifyAuthCode(phoneNum, inputCode)
      const user = await this.User.findOne({ phoneNum })
      if (!user) {
        throw new Error("일치하는 유저가 없음")
      }

      const token = this.generateToken(user)

      return { message: "로그인 성공", token }
    } catch (err) {
      throw new Error(err.message || "로그인 중 오류 발생")
    }
  }
}

export default AuthService
