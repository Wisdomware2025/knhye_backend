// mongodb 연결
import { connect } from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI)
    console.log("MongoDB Atlas 연결 성공")
  } catch (error) {
    console.error("MongoDB 연결 실패:", error)
    process.exit(1)
  }
}

export default connectDB
