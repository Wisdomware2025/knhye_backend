import User from "../../../models/user/User.js"
import AuthCode from "../../../models/user/AuthCode.js"
import { generateToken } from "../../../utils/jwt.js"

class AuthService {
  // constructor({ User, AuthCode, generateToken }) {
  //   this.User = User
  //   this.AuthCode = AuthCode
  //   this.generateToken = generateToken
  // }
  // 인증코드 검증하는 로직
  async verifyAuthCode({ phoneNum, inputCode }) {
    try {
      const storedAuthCode = await AuthCode.findOne({
        phone_number: phoneNum.toString(),
      }).sort({ createdAt: -1 })

      if (
        storedAuthCode === null ||
        new Date() > storedAuthCode.expiration_time
      ) {
        await AuthCode.deleteMany({ phone_number: phoneNum }) // 만료된 인증코드 삭제

        throw new Error("인증 코드가 만료되었거나 존재하지 않습니다.")
      }

      if (inputCode.toString() !== storedAuthCode.auth_code.toString()) {
        throw new Error("인증 코드가 잘못되었습니다.")
      }

      // 인증 성공 후 관련 인증코드 모두 삭제
      await AuthCode.deleteMany({ phone_number: phoneNum })

      return true
    } catch (err) {
      throw new Error()
    }
  }

  // 회원가입 서비스
  async signup({ country, phoneNum, inputCode, username, profileImg, intro }) {
    try {
      const isChecked = await this.verifyAuthCode({ phoneNum, inputCode })

      if (!isChecked) {
        throw new Error("인증 실패")
      }

      const newUser = await new User({
        country,
        phoneNum,
        inputCode,
        username,
        profileImg,
        intro,
      }).save()

      return newUser
    } catch (err) {
      throw new Error("회원가입 중 오류 발생")
    }
  }

  // 로그인 서비스
  async login({ phoneNum, inputCode }) {
    try {
      const isChecked = await this.verifyAuthCode({ phoneNum, inputCode })

      if (!isChecked) {
        throw new Error(err.message)
      }
      const user = await User.findOne({ phoneNum })
      if (!user) {
        throw new Error("일치하는 유저가 없음")
      }

      const payload = {
        userId: user._id,
        username: user.username,
        phoneNum: user.phoneNum,
        inputCode: user.inputCode,
      }

      const token = generateToken(payload)

      return { message: "로그인 성공", token }
    } catch (err) {
      throw new Error(err.message || "로그인 중 오류 발생")
    }
  }

  async findUserById(userId) {
    const user = User.findById(userId)

    if (!user) {
      throw new Error({ status: 404, message: "일치하는 유저가 없음" })
    }

    return true
  }
}

export default AuthService
