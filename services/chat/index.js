class ChatService {
  constructor({ Message }) {
    this.Message = Message
  }

  async saveMessage(senderId, receiverId, message) {
    const newMessage = new this.Message({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
    })

    await newMessage.save()

    // populate로 username도 함께 반환
    return newMessage
      .populate("sender_id", "username")
      .populate("receiver_id", "username")
  }

  async getHistory(userId1, userId2) {
    return await this.Message.find({
      $or: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId1, receiver_id: userId2 },
      ],
    })
      .sort({ timeStamp: 1 })
      .populate("sender_id", "username")
      .populate("receiver_id", "username")
  }
}

export default ChatService
