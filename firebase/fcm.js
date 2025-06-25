import admin from "./firebase.js"

export async function sendNotification(fcmToken, title, body) {
  //보낼 메세지
  const message = {
    notification: {
      title: title,
      body: body, // 알림 본문
    },
    token: fcmToken,
  }

  try {
    //admin.messaging() 호출
    const response = await admin.messaging().send(message)
    console.log("푸시 알림 전송 성공:", response)
  } catch (error) {
    console.error("푸시 알림 전송 실패:", error)

    // 유효하지 않은 토큰이면 DB에서 제거
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      console.warn("유효하지 않은 FCM 토큰입니다. DB에서 삭제 처리합니다.")
      await removeFcmTokenFromDB(fcmToken)
    }
  }
}
