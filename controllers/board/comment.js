class CommentController {
  constructor({ CommentService, LikeService }) {
    this.CommentService = CommentService
    this.LikeService = LikeService
  }

  async getAllCommentsByBoardId(req, res) {
    try {
      const inputBoardId = req.params.boardId

      if (!inputBoardId) {
        return res.status(400).json({ message: "board id를 입력해주세요." })
      }

      const comments = await this.CommentService.getAllCommentsByBoardId(
        inputBoardId
      )

      return res.json(comments)
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  async getAllCommentsByUserId(req, res) {
    try {
      const userId = req.user.userId

      if (!userId) {
        return res.status(403).json({ message: "로그인해주세요" })
      }

      const comments = await this.CommentService.getAllCommentsByUserId(userId)

      return res.json(comments)
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  async createComment(req, res) {
    try {
      const inputBoardId = req.params.boardId
      const data = {
        content: req.body.content,
        author: req.user.userId,
      }

      if (!inputBoardId || !data) {
        return res
          .status(400)
          .json({ message: "board id와 data를 입력해주세요." })
      }

      await this.CommentService.createComment({ inputBoardId, data })

      return res.status(201).json({ message: "댓글 생성 완료" })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  async updateComment(req, res) {
    try {
      const inputCommentId = req.params.id
      const data = {
        content: req.body.content,
      }
      const user = req.user.userId

      if (!inputCommentId || !data) {
        return res
          .status(400)
          .json({ message: "comment id와 data를 입력해주세요." })
      }

      await this.CommentService.updateComment({ inputCommentId, data, user })

      return res.status(200).json({ message: "댓글 수정 완료" })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  async deleteComment(req, res) {
    try {
      const inputCommentId = req.params.id
      const user = req.user.userId

      if (!inputCommentId) {
        return res.status(400).json({ message: "comment id를 입력해주세요." })
      }

      await this.CommentService.deleteComment({ inputCommentId, user })

      return res.status(200).json({ message: "댓글 삭제 완료" })
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }

  async likeOneComment(req, res) {
    try {
      const commentId = req.params.id
      const userId = req.user.userId

      if (!commentId) {
        return res.status(400).json({ message: "comment id를 입력해주세요." })
      }

      const comment = await this.LikeService.toggleLikeComment({
        commentId,
        userId,
      })

      if (!comment) {
        return res.stauts(404).json({ message: "댓글 찾을 수 없음" })
      }

      return res.json(comment)
    } catch (err) {
      return res.status(500).json({ message: "서버 오류" })
    }
  }
}

export default CommentController
