const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// const socket = require("socket.io")
const http = require("http")
const fs = require("fs")

const connDB = require("./config/db")

const authRoutes = require("./routes/auth/index")

require("dotenv").config()

const app = express()
const port = process.env.PORT

const server = http.createServer(app)
//express 서버 위에 WebSocket 서버를 올림
//클라이언트와 연결할 수 있도록 cors 설정
// const io = socket(server, { cors: { origin: "*" } })

//Middleware 설정
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

connDB() // MongoDB 연결

app.use("/auth", authRoutes)

app.listen(port, () => console.log(`Runnig at http://localhost: ${port}`))
