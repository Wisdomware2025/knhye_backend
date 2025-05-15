import Board from "../../models/board/Board.js"

class BoardService {
  constructor({ Board }) {
    this.Board = Board
  }

  async findAllBoards() {
    return await this.Board.find()
  }

  async findOneBoard(id) {
    return await this.Board.findById(id)
  }

  async createBoard(data) {
    const board = new Board(data)
    return await board.save()
  }

  async updateBoard({ id, updateData, user }) {
    const board = await this.Board.findById(id)

    if (!board || board.author.toString() !== user._id.toString()) {
      throw { status: 403, message: "권한이 없습니다." }
    }

    if (!board) throw { status: 404, message: "게시글이 없습니다." }

    schedule.set({
      updateData,
    })

    return await board.save()
  }

  async deleteBoard({ id, user }) {
    const board = await this.Board.findById(id)

    if (!board || board.author.toString() !== user._id.toString()) {
      throw { status: 403, message: "권한이 없습니다." }
    }

    await this.Board.findByIdAndDelete(id)
    return { success: true }
  }
}

export default BoardService
