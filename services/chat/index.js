import mongoose from "mongoose"

const MAX_RETRY_ATTEMPTS = 3

class ChatService {
  constructor({ Message, User, sendNotification }) {
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
      // You might want to throw a more generic error or handle it silently
      throw new Error("메세지 알림 보내기에 실패함")
    }
  }

  async getChatList(userId) {
    const messages = await this.Message.find({
      $or: [
        { sender_id: new mongoose.Types.ObjectId(userId) },
        { receiver_id: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .sort({ timeStamp: -1 })
      .populate("sender_id", "username")
      .populate("receiver_id", "username")

    if (!messages || messages.length === 0) {
      return []
    }

    const chatMap = new Map()

    for (const msg of messages) {
      let otherUser
      // 현재 메시지의 발신자가 userId와 같다면, 수신자가 상대방
      if (String(msg.sender_id._id) === String(userId)) {
        otherUser = msg.receiver_id
      } else {
        // 현재 메시지의 수신자가 userId와 같다면, 발신자가 상대방
        otherUser = msg.sender_id
      }

      if (!otherUser || !otherUser._id) {
        continue // 다음 메시지로 넘어감
      }

      const otherUserId = String(otherUser._id)

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          username: otherUser.username,
          userId: otherUser._id,
          lastMessage: msg.message,
          img: msg.img,
          timeStamp: msg.timeStamp,
          isRead: msg.isRead,
        })
      }
    }

    return Array.from(chatMap.values())
  }

  async saveMessage({ senderId, receiverId, message, img }) {
    const newMessage = await this.Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      img: img,
      isRead: false,
    })

    const populatedMessage = await this.Message.populate(newMessage, [
      { path: "sender_id", select: "username" },
      { path: "receiver_id", select: "username" },
    ])

    try {
      await this.messageNotification({
        senderId: populatedMessage.sender_id._id,
        receiverId: populatedMessage.receiver_id._id,
        message: populatedMessage.message,
      })
    } catch (err) {
      throw new Error("메세지 저장 실패")
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
    return result.map((msg) => ({
      message: msg.message,
      img: msg.img,
      timeStamp: msg.timeStamp,
      isRead: msg.isRead,
      sender: msg.sender_id?.username,
      receiver: msg.receiver_id?.username,
    }))
  }

  async markMessagesAsRead({ me, user }) {
    try {
      const result = await this.Message.updateMany(
        {
          receiver_id: me,
          sender_id: user,
          isRead: false,
        },
        { $set: { isRead: true } }
      )

      return result
    } catch (error) {
      throw new Error("메시지 읽음 표시 실패")
    }
  }
}

export default ChatService
