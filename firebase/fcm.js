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
  } catch (error) {
    // 유효하지 않은 토큰이면 DB에서 제거
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      await removeFcmTokenFromDB(fcmToken)
    }
  }
}
