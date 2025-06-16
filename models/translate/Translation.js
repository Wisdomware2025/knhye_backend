import mongoose from "mongoose"

const TranslationSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String },
    type: { type: String, required: true }, // "country", "korean", "foreign"
    targetLang: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Translation", TranslationSchema)
