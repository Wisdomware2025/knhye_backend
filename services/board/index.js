function getUserIP(req) {
  const addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress
  return addr
}

import LikeService from "../like/index.js"
import Like from "../../models/like/Like.js"
import Board from "../../models/board/Board.js"

const likeService = new LikeService({
  Like,
  Board,
})

class BoardService {
  constructor({ Board }) {
    this.Board = Board
  }

  async findAllBoards() {
    const boards = await this.Board.find()
    const formatBoards = boards.map((boards) => ({
      ...boards.toObject(),
      _id: boards._id.toString(),
    }))

    return formatBoards
  }

  async findFarmerBoards() {
    const boards = await this.Board.find({ role: "farmer" })
    const formatBoards = boards.map((boards) => ({
      title: boards.title,
      authorName: boards.authorName,
      createdAt: boards.createdAt,
      likesCnt: boards.likesCnt,
      viewCnt: boards.viewCnt,
      comments: boards.comments,
      image: boards.image,
      _id: boards._id.toString(),
    }))

    return formatBoards
  }

  async findWorkerBoards() {
    const boards = await this.Board.find({ role: "worker" })
    const formatBoards = boards.map((boards) => ({
      title: boards.title,
      authorName: boards.authorName,
      createdAt: boards.createdAt,
      likesCnt: boards.likesCnt,
      viewCnt: boards.viewCnt,
      comments: boards.comments,
      image: boards.image,
      _id: boards._id.toString(),
    }))

    return formatBoards
  }

  async findBoardsByUserId(userId) {
    const boards = await this.Board.find(userId)
    const formatBoards = boards.map((boards) => ({
      ...boards.toObject(),
      _id: boards._id.toString(),
    }))

    return formatBoards
  }

  async findOneBoard(boardId) {
    if (req.cookies[boardId] == undefined) {
      // key, value, 옵션을 설정해준다.
      res.cookie(boardId, getUserIP(req), {
        // 유효시간 : 12분
        maxAge: 720000,
      })
      // 조회수 증가 쿼리
      await this.Board.updateOne({ boardId }, { $inc: { viewCnt: 1 } })
    }

    const board = await this.Board.findById(boardId)
    const formatBoard = board.map((boards) => ({
      ...board.toObject(),
      _id: boards._id.toString(),
    }))

    return formatBoard
  }

  async createBoard(data) {
    const board = new this.Board(data)
    return await board.save()
  }

  async updateBoard({ boardId, data, user }) {
    const board = await this.Board.findById(boardId)

    if (!board) throw { status: 404, message: "게시글이 없습니다." }

    if (board.author.toString() !== user.toString()) {
      throw { status: 403, message: "권한이 없습니다." }
    }

    board.set({
      ...data,
    })

    return await board.save()
  }

  async deleteBoard({ boardId, user }) {
    const stringBoardId = boardId.toString()
    const board = await this.Board.findById(stringBoardId)

    if (!board) {
      throw { status: 404, message: "게시글이 없습니다." }
    }

    if (board.author.toString() !== user.toString()) {
      throw { status: 403, message: "권한이 없습니다." }
    }

    await this.Board.findByIdAndDelete(stringBoardId)
    return { success: true }
  }

<<<<<<< HEAD
=======
  async handleLike({ userId, boardId }) {
    return await likeService.toggleLikeBoard({ userId, boardId })
  }

>>>>>>> 110da3edfc101ef4f2d3b09149df7bed39c6f281
  async selectBoard({ boardId }) {
    const board = await this.Board.findById(boardId)

    if (!board) {
      throw new Error("board 없음")
    }

    board.isSelected = true
    await board.save()
  }
}

export default BoardService
