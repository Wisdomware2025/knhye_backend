import ChatService from "../../services/chat/index.js"
import AuthService from "../../services/user/auth/index.js"
import Message from "../../models/chat/Message.js"
import User from "../../models/user/User.js"
import { sendNotification } from "../../firebase/fcm.js"
const chatService = new ChatService({
  Message,
  User,
  sendNotification,
})

const userService = new AuthService({
  User,
})

export const getChatList = async (req, res) => {
  try {
    const userId = req.user.userId

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId가 없습니다.",
      })
    }

    const chatList = await chatService.getChatList(userId)

    if (chatList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "채팅 내역이 없습니다.",
        chatList: [],
      })
    }

    return res.status(200).json({
      chatList,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "채팅 목록 불러오기 실패",
    })
  }
}

export const sendMessageToOther = async (req, res) => {
  try {
    const senderId = req.user.userId
    const { receiverId } = req.params
    const { message, img } = req.body

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: senderId, receiverId",
      })
    }

    const newMessage = await chatService.saveMessage({
      senderId,
      receiverId,
      message,
      img,
    })

    if (newMessage.length === 0) {
      return res.status(500).json({ message: "메세지 전송 실패" })
    }

    return res.status(201).json(newMessage)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const me = req.user.userId
    const { user } = req.params

    const user1 = await userService.findUserById({ userId: me })

    const user2 = await userService.findUserById({ userId: user })

    if (!user1 || !user2) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    const messages = await chatService.getHistory({
      userId1: user1._id,
      userId2: user2._id,
    })

    return res.json(messages)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const markMessagesAsRead = async (req, res) => {
  try {
    const me = req.user.userId
    const { user } = req.params

    if (!me || !user) {
      return res.status(400).json({
        success: false,
        message: "사용자 아이디들이 비어있습니다.",
      })
    }

    await chatService.markMessagesAsRead({
      me,
      user,
    })

    return res.status(200).json({ message: "읽음" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
