import ChatService from "../services/chat/index.js"
import Message from "../models/chat/Message.js"
const chatService = new ChatService({
  Message,
})

export const initChatSocket = (io) => {
  let socketConnected = new Set()

  io.on("connection", (socket) => {
    socketConnected.add(socket.id)
    socket.on("joinRoom", async ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-")
      socket.join(room)

      try {
        const history = await chatService.getHistory(senderId, receiverId)

        socket.emit("chatHistory", history)
      } catch (err) {
        socket.emit("error", "cannot get history")
      }
    })

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const savedMessage = await chatService.saveMessage({
          senderId,
          receiverId,
          message,
        })

        const room = [senderId, receiverId].sort().join("-")

        io.to(room).emit("receiveMessage", savedMessage)
      } catch (err) {
        socket.emit("error", "cannot send message")
      }
    })

    socket.on("disconnect", () => {
      socketConnected.delete(socket.id)
    })
  })
}
