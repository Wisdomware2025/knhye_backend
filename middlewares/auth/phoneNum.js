import { body, validationResult } from "express-validator"

export const validatePhoneNum = [
  body("phoneNum")
    .trim() // 앞뒤 공백 제거
    .notEmpty() // 비어있지 않은지 확인
    .withMessage("전화번호를 입력해주세요.")
    .matches(/^\d{11}$/) // 정확히 11자리 숫자인지 확인하는 정규표현식
    .withMessage("전화번호는 11자리 숫자여야 합니다."),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
