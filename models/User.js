const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      maxlength: 255,
      required: true,
    },
    phoneNum: {
      type: String,
      maxlength: 20,
      required: true,
      unique: true,
    },
    inputCode: {
      type: String,
      required: true,
    },
    authCode: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
    },
    intro: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", UserSchema)
