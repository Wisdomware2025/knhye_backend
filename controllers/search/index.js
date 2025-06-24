import SearchService from "../../services/search/index.js"

const searchService = new SearchService()

export const search = async (req, res) => {
  //get 함수에서 문자열을 기대함
  const { query } = req.query

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "검색어(query)가 필요합니다." })
  }

  try {
    const results = await searchService.getSearchAll(query)

    return res.status(200).json(results)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "검색 오류" })
  }
}
