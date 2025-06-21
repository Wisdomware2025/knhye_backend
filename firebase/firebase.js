import admin from "firebase-admin"
import dotenv from "dotenv"

dotenv.config()

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON)

console.log("FIREBASE_CREDENTIALS_JSON:", process.env.FIREBASE_CREDENTIALS_JSON)

// 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
