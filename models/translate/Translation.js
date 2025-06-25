import mongoose from "mongoose"

const TranslationSchema = new mongoose.Schema(
  {
    input: [{ type: String, required: true }], // 문자열 배열로 변경
    output: [{ type: String }], // 문자열 배열로 변경
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Translation", TranslationSchema)
