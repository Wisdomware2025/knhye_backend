import { Router } from "express"
import BoardController from "../../controllers/board/index.js"
import BoardService from "../../services/board/index.js"
import LikeService from "../../services/like/index.js"
import authMiddleware from "../../middlewares/auth/index.js"
import { validateFarmerBoard } from "../../middlewares/board/index.js"
import { validateWorkerBoard } from "../../middlewares/board/index.js"

const router = Router()

const boardController = new BoardController({
  BoardService,
  LikeService,
})

router.get("/", boardController.getAllBoards)
router.get("/farmer", boardController.getAllFarmerBoards)
router.get("/worker", boardController.getAllWorkerBoards)
router.get("/user/:userId", boardController.getBoardsByUserId)
router.get("/:boardId", boardController.getBoardById)
router.post(
  "/farmer",
  authMiddleware,
  validateFarmerBoard,
  boardController.createBoard
)
router.post(
  "/worker",
  authMiddleware,
  validateWorkerBoard,
  boardController.createBoard
)
router.put(
  "/farmer/:boardId",
  authMiddleware,
  validateFarmerBoard,
  boardController.updateBoard
)
router.put(
  "/worker/:boardId",
  authMiddleware,
  validateWorkerBoard,
  boardController.updateBoard
)
router.delete("/:boardId", authMiddleware, boardController.deleteBoard)
router.post("/:boardId/like", authMiddleware, boardController.likeOneBoard)
router.post("/:boardId/select", authMiddleware, boardController.selectOneBoard)

export default router
