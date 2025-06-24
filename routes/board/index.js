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

// GET
router.get("/", (req, res) => boardController.getAllBoards(req, res))
router.get("/farmer", (req, res) =>
  boardController.getAllFarmerBoards(req, res)
)
router.get("/worker", (req, res) =>
  boardController.getAllWorkerBoards(req, res)
)
router.get("/user/:userId", (req, res) =>
  boardController.getBoardsByUserId(req, res)
)
router.get("/:boardId", (req, res) => boardController.getBoardById(req, res))

// POST
router.post("/farmer", authMiddleware, validateFarmerBoard, (req, res) =>
  boardController.createBoard(req, res)
)
router.post("/worker", authMiddleware, validateWorkerBoard, (req, res) =>
  boardController.createBoard(req, res)
)

// PUT
router.put(
  "/farmer/:boardId",
  authMiddleware,
  validateFarmerBoard,
  (req, res) => boardController.updateBoard(req, res)
)
router.put(
  "/worker/:boardId",
  authMiddleware,
  validateWorkerBoard,
  (req, res) => boardController.updateBoard(req, res)
)

// DELETE
router.delete("/:boardId", authMiddleware, (req, res) =>
  boardController.deleteBoard(req, res)
)

// POST (like/select)
router.post("/:boardId/like", authMiddleware, (req, res) =>
  boardController.likeOneBoard(req, res)
)
router.post("/:boardId/select", authMiddleware, (req, res) =>
  boardController.selectOneBoard(req, res)
)

export default router
