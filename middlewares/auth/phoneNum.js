import { body, validationResult } from "express-validator"

export const validatePhoneNum = [
  body("phoneNum").notEmpty().withMessage("전화번호를 입력해주세요"),

  body("phoneNum")
    .matches(/^\+\d{10,15}$/)
    .withMessage("전화번호 형식을 올바르게 입력해주세요"),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
