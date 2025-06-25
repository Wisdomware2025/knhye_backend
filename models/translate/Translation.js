import mongoose from "mongoose"

const TranslationSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Translation", TranslationSchema)
