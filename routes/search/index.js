import { Router } from "express"
import { search } from "../../controllers/search"
import authMiddleware from "../../middlewares/auth"

const router = Router()

router.get("/", authMiddleware, search)

export default router
