import { Schema, model } from "mongoose"

const AuthCodeSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    auth_code: {
      type: String,
      required: true,
    },
    expiration_time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default model("AuthCode", AuthCodeSchema)
