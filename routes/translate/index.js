import {
  handleTranslation,
  cancelTranslate,
} from "../../controllers/translate/index.js"
import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"

const router = Router()

router.post("/", handleTranslation)
router.post("/cancel", cancelTranslate)

export default router
