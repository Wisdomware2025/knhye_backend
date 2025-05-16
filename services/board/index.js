import Board from "../../models/board/Board.js"
import Like from "../../models/board/Like.js"
import Likes from "../../models/board/Like.js"

class BoardService {
  constructor({ Board }) {
    this.Board = Board
    this.Likes = Likes
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

  async likeBoard({ userId, boardId }) {
    //트랜잭션 시작
    const session = await mongoose.startSession()
    // session.startTransaction()

    try {
      // await this.Likes.create([{ userId, boardId }]).session(session)
      // await this.Board.findByIdAndUpdate(boardId, {
      //   $inc: { likesCnt: 1 },
      // }).session(session)

      // await session.commitTransaction()

      await session.withTransaction(async () => {
        await this.Likes.create({ userId, boardId }).session(session)

        await this.Board.updateOne(
          { _id: boardId },
          { $inc: { likesCnt: 1 } }
        ).session(session)
      })
      session.endSession()

      return { success: true }
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      if (err.code == 11000) {
        throw { status: 400, message: "이미 처리된 좋아요" }
      }
      throw err
    }
  }
}

export default BoardService
