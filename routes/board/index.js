import { Router } from "express"
import {
  getAllBoards,
  getBoardsByUserId,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  likeOneBoard,
  selectOneBoard,
  getAllFarmerBoards,
  getAllWorkerBoards,
} from "../../controllers/board/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateFarmerBoard } from "../../middlewares/board/index.js"
import { validateWorkerBoard } from "../../middlewares/board/index.js"

const router = Router()

router.get("/", getAllBoards)
router.get("/farmer", getAllFarmerBoards)
router.get("/worker", getAllWorkerBoards)
router.get("/user/:userId", getBoardsByUserId)
router.get("/board/:boardId", getBoardById)
router.post("/farmer", authMiddleware, validateFarmerBoard, createBoard)
router.post("/worker", authMiddleware, validateWorkerBoard, createBoard)
router.put("/farmer/:boardId", authMiddleware, validateFarmerBoard, updateBoard)
router.put("/worker/:boardId", authMiddleware, validateWorkerBoard, updateBoard)
router.delete("/:boardId", authMiddleware, deleteBoard)
router.post("/:boardId", authMiddleware, likeOneBoard)
router.post("/:boardId", authMiddleware, selectOneBoard)

export default router
