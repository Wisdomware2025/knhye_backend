import axios from "axios"
import dotenv from "dotenv"
import qs from "qs"
dotenv.config()

function generateAuthCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6자리 랜덤 코드
}

class SendCodeService {
  constructor({ AuthCode }) {
    this.AuthCode = AuthCode
  }

  async sendAligo(phoneNum) {
    const authCode = generateAuthCode()

    const body = {
      key: process.env.ALIGO_API_KEY,
      user_id: process.env.ALIGO_USER_ID,
      sender: process.env.SENDER,
      receiver: phoneNum,
      msg: `[일손(ilson)] 인증 번호 [${authCode}]를 입력해주세요.`,
      msg_type: "SMS",
      testmode_yn: "N",
    }

    try {
      const response = await axios.post(
        "https://apis.aligo.in/send/",
        qs.stringify(body),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      const resData = response.data

      if (resData.result_code === "1") {
        await this.AuthCode.deleteMany({ phone_number: phoneNum })

        const expirationTime = new Date(Date.now() + 10 * 60 * 1000)

        await new this.AuthCode({
          phone_number: phoneNum.toString(),
          auth_code: authCode.toString(),
          expiration_time: expirationTime,
        }).save()

        return true
      } else {
        throw new Error(resData.message)
      }
    } catch (err) {
      throw err
    }
  }
}

export default SendCodeService
