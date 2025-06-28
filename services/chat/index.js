class ChatService {
  constructor({ Message }) {
    this.Message = Message
  }

  async getChatList(userId) {
    // 1. 해당 유저가 보낸/받은 모든 메시지를 가져옴
    const messages = await this.Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .sort({ timeStamp: -1 }) // 최근 메시지 기준 정렬
      .populate("sender_id", "username")
      .populate("receiver_id", "username")

    const chatMap = new Map()

    for (const msg of messages) {
      const otherUser =
        String(msg.sender_id._id) === String(userId)
          ? msg.receiver_id
          : msg.sender_id

      const otherUserId = String(otherUser._id)

      if (!chatMap.has(otherUserId)) {
        // // 안 읽은 메시지 수 계산
        // const unreadCount = await this.Message.countDocuments({
        //   sender_id: otherUserId,
        //   receiver_id: userId,
        //   isRead: false,
        // })

        chatMap.set(otherUserId, {
          username: otherUser.username,
          userId: otherUserId,
          lastMessage: msg.message,
          img: msg.img,
          timeStamp: msg.timeStamp,
          isRead: msg.isRead,
          // unreadCount,
        })
      }
    }

    return Array.from(chatMap.values())
  }

  async saveMessage({ senderId, receiverId, message, img }) {
    const newMessage = new this.Message({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      img: img,
      isRead: false,
    })

    await newMessage.save()

    const populatedMessage = await newMessage
      .populate("sender_id", "username")
      .populate("receiver_id", "username")

    // populate로 username도 함께 반환
    return {
      message: populatedMessage.message,
      img: populatedMessage.img,
      timeStamp: populatedMessage.timeStamp,
      isRead: populatedMessage.isRead,
      sender: populatedMessage.sender_id.username,
      receiver: populatedMessage.receiver_id.username,
    }
  }

  async getHistory({ userId1, userId2 }) {
    const result = await this.Message.find({
      $or: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 },
      ],
    })
      .sort({ timeStamp: 1 })
      .populate("sender_id", "username")
      .populate("receiver_id", "username")

    // populate로 username도 함께 반환
    return {
      message: result.message,
      img: result.img,
      timeStamp: result.timeStamp,
      isRead: result.isRead,
      sender: result.sender_id.username,
      receiver: result.receiver_id.username,
    }
  }

  async markMessagesAsRead({ currentUserId, otherUserId }) {
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
