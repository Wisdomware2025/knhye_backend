import Translation from "../../models/translate/Translation.js"
import TranslateService from "../../services/translate/index.js"

const translateService = new TranslateService({
  Translation,
})

//채팅 번역
export const handleTranslation = async (req, res) => {
  const { originTexts, language } = req.body

  const { userId } = req.user.userId

  if (!originTexts || !userId || !language) {
    return res
      .status(400)
      .json({ message: "originTexts, userId, language는 필수입니다." })
  }

  try {
    if (!Array.isArray(originTexts)) {
      originTexts = [originTexts]
    }

    const translatedText = await translateService.processTranslation({
      originTexts,
      userId,
      prompt: `Please translate the following into standard ${language}.`,
    })

    // 성공 응답 전송
    return res.status(200).json({
      translatedText,
    })
  } catch (error) {
    // 에러 응답 전송
    console.error("채팅 번역 중 에러 발생:", error.message)
    return res.status(500).json({
      message: "채팅 텍스트 번역에 실패했습니다.",
    })
  }
}

export const cancelTranslate = async (req, res) => {
  try {
    const { translatedTexts } = req.body
    const { userId } = req.user.userId

    if (!translatedTexts) {
      return res.status(400).json({ message: "번역할 텍스트 없음" })
    }

    const originTexts = await translateService.cancelTranslate({
      translatedTexts,
      userId,
    })

    return res.json({ originTexts })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}
