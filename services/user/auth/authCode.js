import AuthCode from "../../../models/AuthCode"

//인증 코드를 생성하는 함수
function generateAuthCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6자리 랜덤 코드
}

class AuthCodeService {
  // 인증 코드를 발송하는 함수
  async sendAuthCode(phoneNum) {
    let authCode = generateAuthCode()

    try {
      // 인증 코드 발송
      const isSent = await this.sendAuthCodeToUser(phoneNum, authCode)

      // 이전 인증코드는 삭제
      await AuthCode.deleteMany({ phone_number: phoneNum })

      if (isSent) {
        // 발송되면 인증 코드를 DB에 저장
        await this.saveAuthCodeToDB(phoneNum, authCode)
        console.log("인증 번호 저장됨")
      } else {
        console.log("인증 번호 발송 실패")
      }

      // 호출 여부를 반환하지 않을 경우 항상 undefind
      return isSent
    } catch (err) {
      console.log("인증 번호 처리 실패", err)
      return false
    }
  }

  // 인증 코드를 발송
  async sendAuthCodeToUser(phoneNum, authCode) {
    try {
      const res = await message.sendOne({
        to: phoneNum,
        from: process.env.MY_PHONE_NUM, // 발신자 번호
        text: `[일손 (ilson)] 인증 번호 [${authCode}]를 입력해주세요`,
      })

      console.log("인증 번호 발송 성공")
      return true // 성공 시 true 반환
    } catch (err) {
      console.error("인증 번호 발송 실패:", err)
      throw new Error("인증 번호 발송 중 오류 발생")
    }
  }

  // 인증 코드를 DB에 저장
  async saveAuthCodeToDB(phoneNum, authCode) {
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000) // 10분 후 만료 시간 설정

    const newAuthCode = new AuthCode({
      phone_number: phoneNum,
      auth_code: authCode,
      expiration_time: expirationTime,
    })

    try {
      const result = await newAuthCode.save()
      return result
    } catch (err) {
      console.error("인증 코드 DB 저장 실패:", err)
      throw err
    }
  }
}

export default new AuthCodeService()
