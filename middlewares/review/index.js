import { body, validationResult } from "express-validator"

const handleValidationAndAuth = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "로그인 해주세요." })
  }

  next()
}

export const validateReview = [
  body("content").notEmpty().withMessage("내용을 입력해주세요"),
  handleValidationAndAuth,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    next()
  },
]
