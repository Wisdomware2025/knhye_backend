import {
  handleTranslation,
  cancelTranslate,
} from "../../controllers/translate/index.js"
import { Router } from "express"

const router = Router()

router.post("/", handleTranslation)
router.post("/cancel", cancelTranslate)

export default router
