import { Router } from "express"
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../../controllers/board/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateFarmerBoard } from "../../middlewares/board/index.js"
import { validateWorkerBoard } from "../../middlewares/board/index.js"

const router = Router()

router.get("/", getAllBoards)
router.get("/:id", getBoardById)
router.post("/farmer", authMiddleware, validateFarmerBoard, createBoard)
router.post("/worker", authMiddleware, validateWorkerBoard, createBoard)
router.put("/farmer/:id", authMiddleware, validateFarmerBoard, updateBoard)
router.put("/worker/:id", authMiddleware, validateWorkerBoard, updateBoard)
router.delete("/:id", authMiddleware, deleteBoard)

export default router
