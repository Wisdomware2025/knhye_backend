import Translation from "../../models/translate/Translation.js"
import TranslateService from "../../services/translate/index.js"

const translateService = new TranslateService({
  Translation,
})

export const countryToStandard = async (req, res) => {
  const { data } = req.body

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(404).json({ message: "데이터를 입력해주세요." })
  }

  try {
    if (!Array.isArray(data)) {
      // 단일 문자열이 들어올 경우 배열로 감싸주는 로직 추가
      data = [data]
    }
    const result = await translateService.translateText({
      text: data,
      prompt: "다음을 표준어로 번역해줘.",
      type: "country",
    })

    return res.json({ result })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const otherLanguage = async (req, res) => {
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
      prompt: `다음을 ${language}로 번역해주세요.`,
      type: "foreign",
    })

    return res.json({ result })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({ message: "서버 오류" })
  }
}
