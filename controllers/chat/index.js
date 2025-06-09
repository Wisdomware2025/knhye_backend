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

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params

    const user1 = await userService.findUserById(userId1)
    const user2 = await userService.findUserById(userId2)

    if (!user1 || !user2) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    const messages = await chatService.getHistory(userId1, userId2)

    return res.json(messages)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "서버 오류" })
  }
}
