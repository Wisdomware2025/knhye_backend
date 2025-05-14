import Board from "../../models/Board"
import User from "../../models/User"

class SearchService {
  async getSearchAll(query) {
    if (!query) {
      throw new Error("검색어가 필요합니다.")
    }

    const board_idx = "board_index"
    const user_idx = "user_index"

    const [titleResults, contentResults, authorResults, userResults] =
      await Promise.all([
        Board.aggregate([
          {
            $search: {
              index: board_idx,
              autocomplete: {
                query,
                path: "title",
              },
            },
          },
        ]),
        Board.aggregate([
          {
            $search: {
              index: board_idx,
              autocomplete: {
                query,
                path: "content",
              },
            },
          },
        ]),
        Board.aggregate([
          {
            $search: {
              index: board_idx,
              autocomplete: {
                query,
                path: "author",
              },
            },
          },
        ]),
        User.aggregate([
          {
            $search: {
              index: user_idx,
              autocomplete: {
                query,
                path: "username",
              },
            },
          },
        ]),
      ])
    return {
      titles: titleResults,
      contents: contentResults,
      authors: authorResults,
      users: userResults,
    }
  }
}

export default SearchService
