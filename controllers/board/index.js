class BoardController {
  constructor({ BoardService, LikeService }) {
    this.BoardService = BoardService
    this.LikeService = LikeService
  }

  getAllBoards = async (req, res) => {
    try {
      const boards = await this.BoardService.findAllBoards()

      return res.json(boards)
    } catch (err) {
      return res.status(err.status || 500).json({ message: err })
    }
  }

  getAllFarmerBoards = async (req, res) => {
    try {
      const boards = await this.BoardService.findFarmerBoards()

      return res.json(boards)
    } catch (err) {
      return res.status(err.status || 500).json({ message: err })
    }
  }

  getAllWorkerBoards = async (req, res) => {
    try {
      const boards = await this.BoardService.findWorkerBoards()

      return res.json(boards)
    } catch (err) {
      return res.status(err.status || 500).json({ message: err })
    }
  }

  //유저의 모든 게시글 조회
  getBoardsByUserId = async (req, res) => {
    try {
      const userId = req.params

      if (!userId) {
        return res.status(400).json({ message: "사용자 아이디를 입력하세요" })
      }

      const boards = await this.BoardService.findBoardsByUserId(userId)
      return res.json(boards)
    } catch (err) {
      return res.status(500).json({ message: err })
    }
  }

  // 특정 게시글 조회
  getBoardById = async (req, res) => {
    try {
      const boardId = req.params
      const board = await this.BoardService.findOneBoard(boardId)

      if (!board) {
        res.status(404).json({ message: "해당 게시글이 없습니다." })
      }

      return res.json(board)
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  createBoard = async (req, res) => {
    try {
      const data = {
        ...req.body,
        author: req.user.userId,
        authorName: req.user.username,
      }

      if (!data) {
        return res.status(400).json({
          message: "data를 전부 입력했는지, 로그인 되었는지 확인해주세요.",
        })
      }

      const newBoard = await this.BoardService.createBoard(data)
      return res.status(201).json({ message: "게시글 등록 완료", newBoard })
    } catch (err) {
      return res.status(500).json({ message: "게시글 등록 실패" })
    }
  }

  updateBoard = async (req, res) => {
    try {
      const data = {
        ...req.body,
      }

      if (!data) {
        return res.status(400).json({ message: "데이터가 없습니다." })
      }

      const user = req.user.userId

      if (!user) {
        return res.status(403).jsonn({ message: "로그인해주세요" })
      }

      const { boardId } = req.params

      const board = await this.BoardService.updateBoard({ boardId, data, user })

      if (!board) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." })
      }

      return res.status(200).json({ message: "게시글 수정 완료" })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  deleteBoard = async (req, res) => {
    try {
      const { boardId } = req.params
      const user = req.user.userId

      if (!user) {
        return res.status(403).json({ message: "로그인해주세요" })
      }

      await this.BoardService.deleteBoard({ boardId, user })

      return res.status(200).json({ message: "게시글 삭제 완료" })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  likeOneBoard = async (req, res) => {
    try {
      const { userId } = req.user.userId

      if (!userId) {
        return res.status(403).json({ message: "로그인해주세요" })
      }

      const { boardId } = req.params
      const board = await this.LikeService.toggleLikeBoard({ userId, boardId })

      if (!board) {
        return res.stauts(404).json({ message: "게시글을 찾을 수 없음" })
      }

      return res.json(board)
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  selectOneBoard = async (req, res) => {
    try {
      const boardId = req.params
      const board = await this.BoardService.selectBoard(boardId)

      if (!board.success) {
        return res.status(404).json({ message: "게시글 없음" })
      }

      return res.status(200).json({ message: board.message })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }
}

export default BoardController
