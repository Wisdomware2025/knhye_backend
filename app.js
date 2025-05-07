import express, { json, urlencoded } from "express"

import cookieParser from "cookie-parser"

// const socket = require("socket.io")
import { createServer } from "http"

import connDB from "./config/db.js"

import authRoutes from "./routes/user/auth/index.js"
import boardRoutes from "./routes/board/index.js"

import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = process.env.PORT

const server = createServer(app)
//express 서버 위에 WebSocket 서버를 올림
//클라이언트와 연결할 수 있도록 cors 설정
// const io = socket(server, { cors: { origin: "*" } })

//Middleware 설정
app.use(json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

connDB() // MongoDB 연결

app.use("/auth", authRoutes)
app.use("/boards", boardRoutes)

app.listen(port, () => console.log(`Runnig at http://localhost: ${port}`))
