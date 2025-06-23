import openai from "../../config/openai.js"

class TranslateService {
  constructor({ Translation, User }) {
    this.Translation = Translation
    this.User = User
  }

  async processTranslation({ originTexts, userId, prompt, type }) {
    const user = await this.User.findOne({ _id: userId })

    let displayTexts = originTexts

    if (!user) {
      throw new Error("유저를 찾을 수 없음")
    }

    // 타입에 따라 다른 조건 확인
    if (type === "chat" && !user.chatTranslationMode) {
      return
    }
    if (type === "app" && !user.mainLanguage) {
      return
    }

    try {
      const translateTexts = await this.translateText({
        texts: Array.isArray(originTexts) ? originTexts : [originTexts], // translateText가 배열을 받으므로 조정
        prompt: prompt,
        user: user._id,
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
      throw new Error(`${type === "app" ? "앱을 " : ""}번역할 수 없음`)
    }
  }

  async translateText({ texts, prompt, user }) {
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
        userId: user,
      })

      return translatedTexts
    } catch (err) {
      console.log(err)
      throw new Error("번역 실패")
    }
  }

  async cancelTranslate({ translatedTexts, userId }) {
    try {
      const record = this.Translation.findOne({
        output: translatedTexts,
      })

      if (record.userId !== userId) {
        throw new Error("유저가 일치하지 않음")
      }

      if (!record) {
        return { translatedTexts, message: "번역 기록이 없음" }
      }

      return record.input
    } catch (err) {
      console.log(err)
      throw new Error("번역 취소할 수 없음")
    }
  }
}

export default TranslateService
