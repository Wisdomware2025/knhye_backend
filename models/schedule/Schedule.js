import { Schema, model } from "mongoose"

const ScheduleSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
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
  chargeType: {
    type: String,
    required: true,
    default: "시급",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  notificationsSent: { type: Boolean, default: false },
})

export default model("Schedule", ScheduleSchema)
