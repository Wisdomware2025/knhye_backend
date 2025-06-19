import { generateTokens, refreshAccessToken } from "../../../utils/jwt.js"

class AuthService {
  constructor({ User, AuthCode }) {
    this.User = User
    this.AuthCode = AuthCode
  }

  // 인증코드 검증하는 로직
  async verifyAuthCode({ phoneNum, inputCode }) {
    try {
      const storedAuthCode = await this.AuthCode.findOne({
        phone_number: phoneNum.toString(),
      }).sort({ createdAt: -1 })

      if (
        storedAuthCode === null ||
        new Date() > storedAuthCode.expiration_time
      ) {
        await this.AuthCode.deleteMany({ phone_number: phoneNum }) // 만료된 인증코드 삭제

        throw new Error("인증 코드가 만료되었거나 존재하지 않습니다.")
      }

      if (inputCode.toString() !== storedAuthCode.auth_code.toString()) {
        throw new Error("인증 코드가 잘못되었습니다.")
      }

      // 인증 성공 후 관련 인증코드 모두 삭제
      await this.AuthCode.deleteMany({ phone_number: phoneNum })

      return true
    } catch (err) {
      throw new Error("인증 코드 확인 중 알 수 없는 오류 발생")
    }
  }

  // 회원가입 서비스
  async signup({ phoneNum, username, profileImg, intro }) {
    try {
      const existingUser = await this.User.findOne({ phoneNum })
      if (existingUser) {
        throw new Error("이미 가입된 전화번호입니다.")
      }

      const newUser = await new User({
        phoneNum,
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
  async login({ phoneNum }) {
    try {
      const user = await this.User.findOne({ phoneNum })
      if (!user) {
        throw new Error("일치하는 유저가 없음")
      }

      const payload = {
        userId: user._id,
        username: user.username,
        phoneNum: user.phoneNum,
      }

      const { accessToken, refreshToken } = generateTokens(payload)

      return { message: "로그인 성공", accessToken, refreshToken }
    } catch (err) {
      throw new Error(err.message || "로그인 중 오류 발생")
    }
  }

  async refreshUserToken(refreshToken) {
    try {
      const newAccessToken = refreshAccessToken(refreshToken) // utils/jwt.js의 함수 호출
      return { accessToken: newAccessToken }
    } catch (err) {
      // jwt.js에서 던진 에러를 다시 던져서 상위 로직에서 처리
      throw new Error(err.message || "토큰 갱신 중 오류 발생")
    }
  }

  // async findUserById(userId) {
  //   const user = this.User.findById(userId)

  //   if (!user) {
  //     throw new Error({ status: 404, message: "일치하는 유저가 없음" })
  //   }

  //   return true
  // }

  async updateFcmToken({ userId, fcmToken }) {
    const user = await this.User.findById(userId)

    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.")
    }

    const existingTokenIndex = user.fcmTokens.findIndex(
      (t) => t.token === fcmToken
    )

    if (existingTokenIndex > -1) {
      // 이미 존재하는 토큰이거나, 동일한 디바이스에서 토큰을 업데이트하는 경우
      user.fcmTokens[existingTokenIndex].token = fcmToken // 토큰 업데이트
      user.fcmTokens[existingTokenIndex].createdAt = Date.now() // 갱신 시간
    } else {
      // 새로운 토큰 또는 새로운 디바이스의 토큰인 경우
      user.fcmTokens.push({ token: fcmToken })
    }

    await user.save()
    return { message: "FCM 토큰이 성공적으로 업데이트되었습니다." }
  }
}

export default AuthService
