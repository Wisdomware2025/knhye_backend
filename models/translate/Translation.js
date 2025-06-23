import mongoose from "mongoose"

const TranslationSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Translation", TranslationSchema)
