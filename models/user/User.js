import { Schema, model } from "mongoose"

const UserSchema = new Schema(
  {
    phoneNum: {
      type: String,
      // maxlength: 20,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      // maxlength: 50,
      required: true,
    },
    profileImg: {
      type: String,
    },
    intro: {
      type: String,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fcmTokens: [
      {
        token: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default model("User", UserSchema)
