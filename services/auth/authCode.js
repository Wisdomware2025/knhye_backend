const User = require("../../models/User")
const coolsms = require("coolsms-node-sdk").default
const messageService = new coolsms("SMS_API_KEY", "SMS_API_SECRET")
const AuthCode = require("../../models/AuthCode")

function generateAuthCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 인증 코드를 DB에 저장하는 함수
async function saveAuthCodeToDB(phoneNum, authCode) {
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000) // 10분 후 만료 시간 설정

  const newAuthCode = new AuthCode({
    phone_number: phoneNum,
    auth_code: authCode,
    expiration_time: expirationTime,
  })

  try {
    // 인증 코드 저장
    const result = await newAuthCode.save()
    return result
  } catch (err) {
    console.error("인증 코드 DB 저장 실패:", err)
    throw err
  }
}

//인증 코드를 발송하는 함수
async function sendAuthCodeToUser(phoneNum, authCode) {
  try {
    const res = await messageService.sendOne({
      to: phoneNum,
      from: "01047013432", // 실제 발신 번호로 채워야 합니다.
      text: `[일손 (ilson)] 인증 번호 [${authCode}]를 입력해주세요`,
    })

    console.log("인증 번호 발송 성공")
    return true
  } catch (err) {
    console.error("인증 번호 발송 실패:", err)
    throw new Error("인증 번호 발송 중 오류 발생")
  }
}

// 인증 코드 발송, DB 저장
async function sendAuthCode(phoneNum) {
  let authCode = generateAuthCode()

  try {
    const isSent = await sendAuthCodeToUser(phoneNum, authCode)
    if (isSent) {
      await saveAuthCodeToDB(phoneNum, authCode)
      console.log("인증 번호 저장됨")
    } else {
      console.log("인증 번호 저장 실패")
    }

    await AuthCode.deleteMany({ phone_number: phoneNum }) // 이전 코드 제거
  } catch (err) {
    console.log("인증 번호 처리 실패")
    return false
  }
}

module.exports = sendAuthCode
