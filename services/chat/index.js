const MAX_RETRY_ATTEMPTS = 3

class ChatService {
  constructor({ Message }) {
    this.Message = Message
    this.User = User
    this.sendNotification = sendNotification
  }

  // Assuming MAX_RETRY_ATTEMPTS is defined elsewhere, e.g.,

  async messageNotification({ senderId, receiverId, message }) {
    try {
      // Fetch receiver's FCM tokens
      const receiverUser = await this.User.findById(receiverId)

      if (!receiverUser) {
        throw new Error("Receiver not found.")
      }

      const receiverFcmTokens = receiverUser.fcmTokens

      // If no FCM tokens, there's nothing to send
      if (!Array.isArray(receiverFcmTokens) || !receiverFcmTokens.length) {
        return
      }

      // Fetch sender's username for the notification body
      const senderUser = await this.User.findById(senderId)

      if (!senderUser) {
        throw new Error("Sender not found.")
      }

      const title = `[일손(ilson)] ${senderUser} 님이 메세지를 보냈습니다.`
      // Truncate message if it's too long for the notification preview
      const truncatedMessage =
        message.length > 50 ? message.substring(0, 47) + "..." : message
      const body = `${truncatedMessage}`

      let attempts = 0

      while (attempts < MAX_RETRY_ATTEMPTS + 1) {
        try {
          await this.sendNotification(receiverFcmTokens, title, body)
          break // Notification sent successfully, exit loop
        } catch (err) {
          attempts++
          if (attempts < MAX_RETRY_ATTEMPTS + 1) {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
          } else {
            // Max retries reached, re-throw the error
            throw err
          }
        }
      }
    } catch (err) {
      console.error("알림 보내기 실패", err)
      // You might want to throw a more generic error or handle it silently
      throw new Error("메세지 알림 보내기에 실패함")
    }
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
          img: "사진을 보냈습니다.",
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

    try {
      await this.messageNotification({
        senderId: populatedMessage.sender_id._id,
        receiverId: populatedMessage.receiver_id._id,
        message: populatedMessage.message,
      })
    } catch (err) {
      console.error(err)
    }

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
