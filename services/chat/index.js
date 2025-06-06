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
