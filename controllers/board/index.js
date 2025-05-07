import BoardService from "../../services/board/index.js"
import Board from "../../models/Board.js"

const boardService = new BoardService({
  Board,
})

//모든 게시글 조회
export const getAllBoards = async (req, res) => {
  try {
    const boards = await boardService.findAllBoards()
    res.json(boards)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

// 특정 게시글 조회
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params
    const board = await boardService.findOneBoard(id)

    if (!board) {
      res
        .status(404)
        .json({ message: "해당 게시글이 없거나 유저가 일치하지 않습니다." })
    }

    res.json(board)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "서버 오류" })
  }
}

export const createBoard = async (req, res) => {
  try {
    const data = {
      ...req.body,
      author: req.user.id,
    }

    if (!data.author) {
      return res.status(401).json({ message: "로그인 해주세요" })
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
      author: req.user.username,
    }

    const { id } = req.params
    const board = await boardService.updateBoard(id, data)

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
    const { id } = req.params
    const deleted = await boardService.deleteBoard(id, req.user)

    if (!deleted) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." })
    }

    return res.status(200).json({ message: "게시글 삭제 완료" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}
