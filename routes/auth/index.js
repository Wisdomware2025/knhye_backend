const express = require("express")
const router = express.Router()
const authController = require("../../controllers/auth/index")

router.post("/send-code", authController.sendAuthCode)
router.post("/signup", authController.signup)

module.exports = router
