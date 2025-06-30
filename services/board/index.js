function getUserIP(req) {
  const addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress
  return addr
}

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

  async findOneBoard({ boardId }) {
    // if (req.cookies[boardId] == undefined) {
    //   // key, value, 옵션을 설정해준다.
    //   res.cookie(boardId, getUserIP(req), {
    //     // 유효시간 : 12분
    //     maxAge: 720000,
    //   })
    //   // 조회수 증가 쿼리
    //   await this.Board.updateOne({ boardId }, { $inc: { viewCnt: 1 } })
    // }
    const board = await this.Board.findById(boardId)

    return board
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

  async selectBoard({ boardId }) {
    let message
    const board = await this.Board.findById(boardId)

    if (!board) {
      throw new Error("board 없음")
    }

    if (board.isSelected) {
      board.isSelected = false
      message = "구인 취소됨"
    } else {
      board.isSelected = true
      message = "구인 완료됨"
    }

    await board.save()

    return { success: true, message: message }
  }
}

export default BoardService
