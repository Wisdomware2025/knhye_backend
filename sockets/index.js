import ChatService from "../services/chat/index.js"

const authService = new AuthService({
  User,
})

const chatService = new ChatService({
  Message,
})

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-")
      socket.join(room)

      console.log(`join room : ${room}`)

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
      console.log("disconnect")
    })
  })
}
