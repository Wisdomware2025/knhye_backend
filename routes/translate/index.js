import {
  translatePages,
  translateStandard,
} from "../../controllers/translate/index.js"
import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"

const router = Router()

router.post("/standard", authMiddleware, translateStandard)
router.post("/pages", authMiddleware, translatePages)

export default router
