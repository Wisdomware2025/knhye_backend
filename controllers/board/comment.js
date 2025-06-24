import CommentService from "../../services/board/comment.js"
import Comment from "../../models/board/Comment.js"
import Like from "../../models/like/Like.js"
import LikeService from "../../services/like/index.js"

const commentService = new CommentService({
  Comment,
})

const likeService = new LikeService({
  Comment,
  Like,
})

export const getAllCommentsByBoardId = async (req, res) => {
  try {
    const inputBoardId = req.params.boardId

    if (inputBoardId.length() === 0) {
      return res.status(400).json({ message: "board id를 입력해주세요." })
    }

    const comments = await commentService.getAllCommentsByBoardId(inputBoardId)

    return res.json(comments)
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const getAllCommentsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId

    if (!userId) {
      return res.status(403).json({ message: "로그인해주세요" })
    }

    const comments = await commentService.getAllCommentsByUserId(userId)

    return res.json(comments)
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const createComment = async (req, res) => {
  try {
    const inputBoardId = req.params.boardId
    const data = {
      content: req.body.content,
      author: req.user.userId,
    }

    if (inputBoardId.length() === 0 || data.length() === 0) {
      return res
        .status(400)
        .json({ message: "board id와 data를 입력해주세요." })
    }

    await commentService.createComment({ inputBoardId, data })

    return res.status(201).json({ message: "댓글 생성 완료" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const updateComment = async (req, res) => {
  try {
    const inputCommentId = req.params.id
    const data = {
      content: req.body.content,
    }

    if (!data) {
      return res.status(400).json({ message: "데이터를 정확하게 입력하세요" })
    }

    const user = req.user.userId

    if (!user) {
      return res.status(403).json({ message: "로그인해주세요" })
    }

    await commentService.updateComment({ inputCommentId, data, user })

    return res.status(200).json({ message: "댓글 수정 완료" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const inputCommentId = req.params.id
    const user = req.user.userId

    if (!user) {
      return res.status(403).json({ message: "로그인해주세요" })
    }

    await commentService.deleteComment({ inputCommentId, user })

    return res.status(200).json({ message: "댓글 삭제 완료" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const likeOneComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.userId

    const comment = await likeService.toggleLikeComment({ commentId, userId })

    if (!comment) {
      return res.status(404).json({ message: "댓글 찾을 수 없음" })
    }

    return res.json(comment)
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
