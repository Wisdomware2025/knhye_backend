import openai from "../../config/openai.js"

class TranslateService {
  constructor({ Translation }) {
    this.Translation = Translation
  }

  async translateText({ texts, prompt }) {
    try {
      if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error("texts가 비었거나 유효하지 않습니다.")
      }

      const systemContent = `You are a strict translation assistant. Translate every user input according to these rules:
- If translation is not possible, output the original text.
- Separate translated texts with '---TRANSLATION_SEPARATOR---'.
- The output must end with '---TRANSLATION_SEPARATOR---'.
- The number of output texts must match the number of input texts.`

      // texts 배열을 JSON 문자열로 만들어 한번에 전달
      const userContent = `${prompt}\nTranslate the following texts:\n${JSON.stringify(
        texts,
        null,
        2
      )}`

      const messages = [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userContent,
        },
      ]

      console.log(messages)

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages,
      })

      const res = completion?.choices?.[0]?.message?.content

      console.log(res)
      if (!res) {
        return texts
      }

      const translatedTexts = res
        .split("---TRANSLATION_SEPARATOR---")
        .map((s) => s.trim())
        .filter(Boolean)

      console.log(translatedTexts)

      if (translatedTexts.length !== texts.length) {
        throw new Error(
          `번역된 텍스트 수가 다릅니다. 기대: ${texts.length}, 실제: ${translatedTexts.length}`
        )
      }

      await this.Translation.create({
        input: texts,
        output: translatedTexts,
      })

      return translatedTexts
    } catch (err) {
      throw new Error("번역 실패: " + err.message)
    }
  }

  async processTranslation({ originTexts, prompt }) {
    let displayTexts = originTexts

    try {
      const translateTexts = await this.translateText({
        texts: Array.isArray(originTexts) ? originTexts : [originTexts], // translateText가 배열을 받으므로 조정
        prompt: prompt,
      })

      // 번역된 텍스트 수 일치 여부 확인
      const expectedLength = Array.isArray(originTexts) ? originTexts.length : 1

      if (translateTexts.length === expectedLength) {
        displayTexts = Array.isArray(originTexts)
          ? translateTexts
          : translateTexts[0]
      } else {
        console.warn(
          "번역된 텍스트 수와 원본 텍스트 수가 일치하지 않습니다. 원본 텍스트를 사용합니다."
        )
        displayTexts = originTexts // 풀백으로 사용
      }

      return displayTexts
    } catch (err) {
      console.log(err)
      // 타입에 따라 다른 에러 메시지
      throw new Error("번역할 수 없음", err)
    }
  }

  async cancelTranslate({ translatedTexts }) {
    try {
      const record = this.Translation.findOne({
        output: translatedTexts,
      })

      if (!record) {
        return { translatedTexts, message: "번역 기록이 없음" }
      }

      return record.input
    } catch (err) {
      throw new Error("번역 취소할 수 없음")
    }
  }
}

export default TranslateService
