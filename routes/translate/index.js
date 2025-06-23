import {
  handleTranslation,
  cancelTranslate,
} from "../../controllers/translate/index.js"
import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"

const router = Router()

router.post("/", authMiddleware, handleTranslation)
router.post("/cancel", authMiddleware, cancelTranslate)

export default router
