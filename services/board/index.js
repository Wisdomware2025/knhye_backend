function getUserIP(req) {
  const addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress
  return addr
}

class BoardService {
  constructor({ Board, LikeService }) {
    this.Board = Board
    this.LikeService = LikeService
  }

  async findBoardsByUserId(userId) {
    return await this.Board.find(userId)
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

    return await this.Board.findById(boardId)
  }

  async createBoard(data) {
    const board = new this.Board(data)
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

  async handleLike({ userId, boardId }) {
    return await this.LikeService.toggleLikeBoard({ userId, boardId })
  }

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
