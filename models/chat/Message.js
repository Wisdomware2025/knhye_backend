import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timeStamp: { type: Date, default: Date.now },
  isRead: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model("Message", MessageSchema)
