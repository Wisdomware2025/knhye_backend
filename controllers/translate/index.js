import Translation from "../../models/translate/Translation.js"
import TranslateService from "../../services/translate/index.js"

const translateService = new TranslateService({
  Translation,
})

export const translateStandard = async (req, res) => {
  const { data, language } = req.body

  if (!Array.isArray(data) || data.length === 0 || !language) {
    return res.status(404).json({ message: "데이터를 입력해주세요." })
  }

  try {
    if (!Array.isArray(data)) {
      // 단일 문자열이 들어올 경우 배열로 감싸주는 로직 추가
      data = [data]
    }
    const result = await translateService.translateText({
      text: data,
      prompt: `Please translate the following into standard ${language}.`,
    })

    return res.json({ result })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const translatePages = async (req, res) => {
  const { texts, prompt } = req.body

  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return res
      .status(400)
      .json({ message: "번역할 텍스트(texts) 배열이 필요합니다." })
  }
  if (!prompt || typeof prompt !== "string") {
    return res
      .status(400)
      .json({ message: "번역 프롬프트(prompt)가 필요합니다." })
  }

  try {
    const translatedTexts = await translateService.translateText({
      texts,
      prompt,
    })

    return res.status(200).json({ translatedTexts })
  } catch (error) {
    console.error("텍스트 번역 중 오류 발생:", error)
    // 클라이언트에게는 일반적인 오류 메시지를 전달하고, 상세 에러는 서버 로그에 남깁니다.
    return res
      .status(500)
      .json({ message: "텍스트 번역에 실패했습니다.", error: error.message })
  }
}
