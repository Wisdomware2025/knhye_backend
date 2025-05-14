import express from "express"
import { search } from "../../controllers/search"
import authMiddleware from "../../middlewares/auth"

const router = express.Router()

router.get("/", authMiddleware, search)

export default router
