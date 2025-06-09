<<<<<<< HEAD
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
=======
// import ChatService from "../../services/chat"

// const chatService = new ChatService({
//   User,
//   Message,
// })

// export const joinRoom = async (req, res) ={
//   // 1대1 채팅방 생성
// }

// export const sendMessage = async (req, res) =>{
//   // 메세지 보내기
// }

// export const translateMessage = async(req, res)=>{
//   //번역 요청하기
// }

// export const exitRoomm = async(req, res)=>{
//   //방 나가기
// }

// export const disconnect = async(req, res)=>{
//   //연결 해제
// }
>>>>>>> 110da3edfc101ef4f2d3b09149df7bed39c6f281
