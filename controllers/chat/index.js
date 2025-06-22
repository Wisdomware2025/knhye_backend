import ChatService from "../../services/chat/index.js"
import AuthService from "../../services/user/auth/index.js"
import Message from "../../models/chat/Message.js"
import User from "../../models/user/User.js"
const chatService = new ChatService({
  Message,
})

const userService = new AuthService({
  User,
})

export const sendMessageToOther = async (req, res) => {
  try {
    const { senderId } = req.user.userId
    const { receiverId } = req.params
    const { message } = req.body

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: senderId, receiverId, or message.",
      })
    }

    const newMessage = await chatService.saveMessage({
      senderId,
      receiverId,
      message,
    })

    if (newMessage.length() === 0) {
      return res.status(500).json({ message: "메세지 전송 실패" })
    }

    return res.status(201).json(newMessage)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { me } = req.user.userId
    const { user } = req.params

    const user1 = await userService.findUserById(me)
    const user2 = await userService.findUserById(user)

    if (!user1 || !user2) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    const messages = await chatService.getHistory(user1, user2)

    if (messages.length() === 0) {
      return res.status(404).json({ message: "메세지가 없습니다." })
    }
    return res.json(messages)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "서버 오류" })
  }
}
