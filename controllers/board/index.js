import BoardService from "../../services/board/index.js"
import Board from "../../models/board/Board.js"
import LikeService from "../../services/like/index.js"
import Like from "../../models/like/Like.js"

const boardService = new BoardService({
  Board,
})

<<<<<<< HEAD
const likeService = new LikeService({
  Like,
  Board,
})

=======
>>>>>>> 110da3edfc101ef4f2d3b09149df7bed39c6f281
export const getAllBoards = async (req, res) => {
  try {
    const boards = await boardService.findAllBoards()

    return res.json(boards)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err })
  }
}

export const getAllFarmerBoards = async (req, res) => {
  try {
    const boards = await boardService.findFarmerBoards()

    return res.json(boards)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err })
  }
}

export const getAllWorkerBoards = async (req, res) => {
  try {
    const boards = await boardService.findWorkerBoards()

    return res.json(boards)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err })
  }
}

//유저의 모든 게시글 조회
export const getBoardsByUserId = async (req, res) => {
  try {
    const userId = req.params
    const boards = await boardService.findBoardsByUserId(userId)
    return res.json(boards)
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

// 특정 게시글 조회
export const getBoardById = async (req, res) => {
  try {
    const boardId = req.params
    const board = await boardService.findOneBoard(boardId)

    if (!board) {
      res
        .status(404)
        .json({ message: "해당 게시글이 없거나 유저가 일치하지 않습니다." })
    }

    return res.json(board)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const createBoard = async (req, res) => {
  try {
    const data = {
      ...req.body,
      author: req.user.userId,
      authorName: req.user.username,
    }

    const newBoard = await boardService.createBoard(data)
    return res.status(201).json({ message: "게시글 등록 완료", newBoard })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "게시글 등록 실패" })
  }
}

export const updateBoard = async (req, res) => {
  try {
    const data = {
      ...req.body,
    }
    const user = req.user.userId
    const { boardId } = req.params
    const board = await boardService.updateBoard({ boardId, data, user })

    if (!board) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." })
    }

    return res.status(200).json({ message: "게시글 수정 완료" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params
    const user = req.user.userId
    const deleted = await boardService.deleteBoard({ boardId, user })

    if (!deleted) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." })
    }

    return res.status(200).json({ message: "게시글 삭제 완료" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const likeOneBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params
    const board = await likeService.toggleLikeBoard({ userId, boardId })

    if (!board) {
      return res.stauts(404).json({ message: "게시글을 찾을 수 없음" })
    }

    return res.status(200).json({ message: board.message })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const selectOneBoard = async (req, res) => {
  try {
    const boardId = req.params
    const board = await boardService.selectBoard(boardId)

    if (!board) {
      return res.status(404).json({ message: "게시글 없음" })
    }

    return res.status(200).json({ message: "구인 완료됨" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
