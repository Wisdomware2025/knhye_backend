class SearchService {
  constructor({ Board, User }) {
    this.Board = Board
    this.User = User
  }
  async getSearchAll(query) {
    if (!query) {
      throw new Error("검색어가 필요합니다.")
    }

    const board_idx = "board_index"
    const user_idx = "user_index"

    const [titleResults, contentResults, authorResults, userResults] =
      await Promise.all([
        this.Board.aggregate([
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
        this.Board.aggregate([
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
        this.Board.aggregate([
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
        this.User.aggregate([
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
