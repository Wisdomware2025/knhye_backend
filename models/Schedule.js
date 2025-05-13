import { Schema, model } from "mongoose"

const ScheduleSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  workers: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  charge: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  fcmToken: {
    type: String,
    required: true,
  },
})

export default model("Schedule", ScheduleSchema)
