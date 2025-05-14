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

// 농부 게시글
export const validateFarmerBoard = [
  body("title").notEmpty().withMessage("제목을 입력해주세요."),
  body("content").notEmpty().withMessage("내용을 입력해주세요."),
  body("location").notEmpty().withMessage("위치를 입력해주세요."),
  body("work").notEmpty().withMessage("업무를 입력해주세요."),
  body("date").notEmpty().withMessage("날짜와 시간을 입력해주세요."),
  body("charge").notEmpty().withMessage("급여를 입력해주세요."),
  handleValidationAndAuth,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    next()
  },
]

// 근로자 게시글
export const validateWorkerBoard = [
  body("title").notEmpty().withMessage("제목을 입력해주세요."),
  body("content").notEmpty().withMessage("내용을 입력해주세요."),
  handleValidationAndAuth,

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    next()
  },
]
