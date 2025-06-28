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
  },
  img: {
    type: String,
  },
  timeStamp: { type: Date, default: Date.now },
  isRead: {
    type: Boolean,
    default: false,
  },
})

MessageSchema.pre("validate", function (next) {
  if (!this.message && !this.img) {
    this.invalidate(
      "message",
      "message 또는 img 중 하나는 반드시 입력해야 합니다."
    )
    this.invalidate("img", "message 또는 img 중 하나는 반드시 입력해야 합니다.")
  }
  next()
})

export default mongoose.model("Message", MessageSchema)
