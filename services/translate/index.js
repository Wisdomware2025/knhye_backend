import openai from "../../config/openai.js"

class TranslateService {
  constructor({ Translation }) {
    this.Translation = Translation
  }
  async translateText({ texts, prompt, type }) {
    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful translation assistant. Translate each user query using the provided prompt. Respond with the translated texts, separating each with '---TRANSLATION_SEPARATOR---'. Ensure the separator is included after every translation, including the last one.",
        },
      ]

      // 각 텍스트에 대한 사용자 메시지 추가
      texts.forEach((textItem) => {
        messages.push({ role: "user", content: `${prompt} : ${textItem}` })
      })

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages,
      })
      //OpenAI API가 반환한 응답에서 번역된 결과 텍스트(content)를 꺼내서 함수의 반환값으로 돌려줌
      const res = completion.choices[0].message.content

      //번역된 텍스트 분리
      //마지막 빈 문자열 제거를 위해 filter(Boolean)
      const translatedTexts = res
        .split("---TRANSLATION_SEPARATOR---")
        .map((s) => s.trim())
        .filter(Boolean)

      if (translatedTexts.length !== texts.length) {
        throw new Error("번역된 텍스트 수가 다름")
      }

      await this.Translation.create({
        input: texts,
        output: translatedTexts,
        type: type,
      })

      return translatedTexts
    } catch (err) {
      console.log(err)
      throw new Error("번역 실패")
    }
  }
}

export default TranslateService
