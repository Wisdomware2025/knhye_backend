import { Router } from "express"
import BoardController from "../../controllers/board/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateFarmerBoard } from "../../middlewares/board/index.js"
import { validateWorkerBoard } from "../../middlewares/board/index.js"

const router = Router()

router.get("/", BoardController.getAllBoards)
router.get("/farmer", BoardController.getAllFarmerBoards)
router.get("/worker", BoardController.getAllWorkerBoards)
router.get("/:userId", BoardController.getBoardsByUserId)
router.get("/:boardId", BoardController.getBoardById)
router.post(
  "/farmer",
  authMiddleware,
  validateFarmerBoard,
  BoardController.createBoard
)
router.post(
  "/worker",
  authMiddleware,
  validateWorkerBoard,
  BoardController.createBoard
)
router.put(
  "/farmer/:boardId",
  authMiddleware,
  validateFarmerBoard,
  BoardController.updateBoard
)
router.put(
  "/worker/:boardId",
  authMiddleware,
  validateWorkerBoard,
  BoardController.updateBoard
)
router.delete("/:boardId", authMiddleware, BoardController.deleteBoard)
router.post("/:boardId", authMiddleware, BoardController.likeOneBoard)
router.post("/:boardId", authMiddleware, BoardController.selectOneBoard)

export default router
