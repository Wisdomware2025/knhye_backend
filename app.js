import express, { json, urlencoded } from "express"

import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import authRoutes from "./routes/user/auth/index.js"
import profileRoutes from "./routes/user/profile/index.js"
import boardRoutes from "./routes/board/index.js"
import scheduleRoutes from "./routes/schedule/index.js"
import searchRoutes from "./routes/search/index.js"
import reviewRoutes from "./routes/review/index.js"
import friendRoutes from "./routes/user/friend/index.js"

import dotenv from "dotenv"
import connectDB from "./config/db.js"
dotenv.config()

const app = express()
const port = process.env.PORT

//Middleware 설정
app.use(json())
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

connectDB() // MongoDB 연결

app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/boards", boardRoutes)
app.use("/schedules", scheduleRoutes)
app.use("/search", searchRoutes)
app.use("/reviews", reviewRoutes)
app.use("/friends", friendRoutes)

app.listen(port, () => console.log(`Runnig at http://localhost: ${port}`))
