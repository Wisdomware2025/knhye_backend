import { Router } from "express"
import { search } from "../../controllers/search/index.js"
import authMiddleware from "../../middlewares/auth/index.js"

const router = Router()

router.get("/", authMiddleware, search)

export default router
