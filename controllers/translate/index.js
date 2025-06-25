import Translation from "../../models/translate/Translation.js"
import TranslateService from "../../services/translate/index.js"

const translateService = new TranslateService({
  Translation,
})

export const handleTranslation = async (req, res) => {
  const { originTexts, language } = req.body

  if (!originTexts || !language) {
    return res
      .status(400)
      .json({ message: "originTexts, language는 필수입니다." })
  }

  try {
    const translatedText = await translateService.processTranslation({
      originTexts,
      prompt: `Please translate the following into standard ${language}.`,
    })

    if (!translatedText) {
      return res.status(404).json({ message: err })
    }

    // 성공 응답 전송
    return res.status(200).json({
      translatedText,
    })
  } catch (error) {
    return res.status(500).json({
      message: "채팅 텍스트 번역에 실패했습니다.",
    })
  }
}

export const cancelTranslate = async (req, res) => {
  try {
    const { translatedTexts } = req.body

    if (!translatedTexts) {
      return res.status(400).json({ message: "번역할 텍스트 없음" })
    }

    const originTexts = await translateService.cancelTranslate({
      translatedTexts,
    })

    return res.json({ originTexts })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}
