import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import http from "http"

import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/user/auth/index.js"
import profileRoutes from "./routes/user/profile/index.js"
import boardRoutes from "./routes/board/index.js"
import scheduleRoutes from "./routes/schedule/index.js"
import searchRoutes from "./routes/search/index.js"
import reviewRoutes from "./routes/review/index.js"
import friendRoutes from "./routes/user/friend/index.js"
import chatRoutes from "./routes/chat/index.js"

import connectDB from "./config/db.js"
connectDB() // MongoDB 연결

const app = express()
const port = process.env.PORT

// 미들웨어
app.set("port", port)
app.use(cors({ origin: "*" }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

// 라우터
app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/boards", boardRoutes)
app.use("/schedules", scheduleRoutes)
app.use("/search", searchRoutes)
app.use("/reviews", reviewRoutes)
app.use("/friends", friendRoutes)
app.use("/chats", chatRoutes)

// http + socket 통합 서버 생성
const server = http.createServer(app)

<<<<<<< HEAD
// 소켓 서버 설정
import { Server } from "socket.io"

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

let socketConnected = new Set()

io.on("connection", (socket) => {
  console.log("a user connected")
  socketConnected.add(socket.id)

  socket.on("disconnect", () => {
    socketConnected.delete(socket.id)
  })
})
=======
// // 소켓 서버 설정
// import { Server } from "socket.io"

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["*"],
//   },
// })

// io.on("connection", (socket) => {
//   console.log("a user connected")
// })
>>>>>>> 110da3edfc101ef4f2d3b09149df7bed39c6f281

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})
