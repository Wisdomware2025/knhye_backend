class ChatService {
  constructor({ Message }) {
    this.Message = Message
  }

  async saveMessage({ senderId, receiverId, message }) {
    const newMessage = new this.Message({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      isRead: false,
    })

    await newMessage.save()

    // populate로 username도 함께 반환
    return newMessage
      .populate("sender_id", "username")
      .populate("receiver_id", "username")
  }

  async getHistory({ userId1, userId2 }) {
    return await this.Message.find({
      $or: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 },
      ],
    })
      .sort({ timeStamp: 1 })
      .populate("sender_id", "username")
      .populate("receiver_id", "username")
  }

  async markMessagesAsRead(currentUserId, otherUserId) {
    try {
      const result = await this.Message.updateMany(
        {
          receiver_id: currentUserId,
          sender_id: otherUserId,
          isRead: false,
        },
        { $set: { isRead: true } }
      )

      return result
    } catch (error) {
      console.error("메시지를 읽음으로 표시하는 중 오류 발생:", error)
      throw new Error("메시지 읽음 표시 실패")
    }
  }
}

export default ChatService
