import mongoose from "mongoose"

class CommentService {
  constructor({ Comment }) {
    this.Comment = Comment
  }

  async getAllCommentsByBoardId(inputBoardId) {
    const comments = await this.Comment.find({
      boardId: inputBoardId,
    })

    if (!comments) {
      throw new Error("댓글이 없습니다.")
    }

    return comments
  }

  async createComment({ inputBoardId, data }) {
    const formatId = new mongoose.Types.ObjectId(inputBoardId)

    const newComment = new this.Comment({
      ...data,
      boardId: formatId,
    })

    return await newComment.save()
  }

  async updateComment({ inputCommentId, data, user }) {
    const comment = await this.Comment.findById(inputCommentId)

    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.")
    }

    if (comment.author.toString() !== user.toString()) {
      throw new Error("권한이 없습니다.")
    }

    comment.set({
      ...data,
    })

    return await comment.save()
  }

  async deleteComment({ inputCommentId, user }) {
    const comment = await this.Comment.findById(inputCommentId)

    if (!comment) {
      throw new Error("게시글이 없습니다.")
    }

    if (comment.author.toString() !== user.toString()) {
      throw new Error("권한이 없습니다.")
    }

    return await comment.deleteOne()
  }
}

export default CommentService
