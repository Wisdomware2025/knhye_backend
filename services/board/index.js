import Board from "../../models/Board.js"

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

  async updateBoard(id, updateData, user) {
    const board = await this.Board.findOne({ _id: id, author: user._id })
    if (!board) return null

    Object.assign(board, updateData)
    return await board.save()
  }

  async deleteBoard(id, user) {
    const board = await this.Board.findById(id)

    if (!board || board.author.toString() !== user._id.toString()) {
      return null
    }

    await this.Board.findByIdAndDelete(id)
    return { success: true }
  }
}

export default BoardService
