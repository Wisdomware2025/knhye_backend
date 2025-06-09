<<<<<<< HEAD
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
=======
// import axios from "axios"
// import { format } from "data-fns"
// import io, { Socket } from "socket.io"

// const users = {}
// const chatRooms = {}

// class ChatService {
//   async joinRoom(socket, { roomId, userId }) {
//     socket.join(roomId)
//     users[socket.id] = userId

//     // 채팅방이 없을 경우 새로 생성함
//     if (!chatRooms[roomId]) {
//       chatRooms[roomId] = []
//     }

//     return chatRooms[roomId]
//   }

//   async sendMessage(io, { roomId, sender, content, time }) {
//     const date = format(new Date(time), "yyyy-mm-dd")

//     const lastMessage = chatRooms[roomId] || []
//     //이전 날짜 확인
//     const lastDate = lastMessage.length
//       ? format(new Date(lastMessage[lastMessage.length - 1].time), "yyyy-mm-dd")
//       : null
//     const currentDate = lastDate !== date

//     const message = { sender, content, time, currentDate }
//     chatRooms[roomId].push(message)
//   }
// }

// export default ChatService
>>>>>>> 110da3edfc101ef4f2d3b09149df7bed39c6f281
