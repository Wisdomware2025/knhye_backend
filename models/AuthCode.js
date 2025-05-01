const mongoose = require("mongoose")

const AuthCodeSchema = new mongoose.Schema(
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

module.exports = mongoose.model("AuthCode", AuthCodeSchema)
