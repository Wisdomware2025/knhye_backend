import {
  countryToStandard,
  otherLanguage,
} from "../../controllers/translate/index.js"
import { Router } from "express"
import authMiddleware from "../../middlewares/auth/index.js"

const router = Router()

router.post("/country-to-standard", authMiddleware, countryToStandard)
router.post("/other-language", authMiddleware, otherLanguage)

export default router
