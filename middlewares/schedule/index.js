import { body, validationResult } from "express-validator"

const scheduleMiddleware = [
  body("time").notEmpty().withMessage("시간를 입력해주세요."),
  body("workers").notEmpty().withMessage("함께하는 근로자를 입력해주세요."),
  body("work").notEmpty().withMessage("주요 업무를 입력해주세요."),
  body("location").notEmpty().withMessage("위치를 입력해주세요."),
  body("charge").notEmpty().withMessage("일당를 입력해주세요."),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    next()
  },
]

export default scheduleMiddleware
