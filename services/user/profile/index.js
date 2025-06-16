class ProfileService {
  constructor({ User }) {
    this.User = User
  }

  async getPopularUsers(role) {
    const users = await this.User.find()

    if (!users || !Array.isArray(users)) {
      return []
    }

    // 인기 농장주 요청 시 리뷰 role은 worker
    // 인기 근로자 요청 시 리뷰 role은 farmer
    let targetReviewRole = null
    if (role === "farmer") {
      targetReviewRole = "worker"
    } else if (role === "worker") {
      targetReviewRole = "farmer"
    }

    const usersSatisfactionCnt = users.map((user) => {
      const userOb = user.toObject ? user.toObject() : user

      //한달전 계산
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      // 리뷰가 없는 경우 0으로 초기화
      const cnt = userOb.reviews
        ? userOb.reviews.filter((review) => {
            // 한 달 이내인지
            let isSatisfiedAndRecent =
              review.isSatisfaction && new Date(review.createdAt) >= oneMonthAgo

            // 역할 필터링
            if (targetReviewRole) {
              return isSatisfiedAndRecent && review.role === targetReviewRole
            }

            // targetReviewRole이 설정되지 않았다면 기본 필터링 조건만 적용
            return isSatisfiedAndRecent
          }).length
        : 0

      return {
        ...userOb,
        satisfactionCnt: cnt,
      }
    })

    usersSatisfactionCnt.sort((a, b) => b.satisfactionCnt - a.satisfactionCnt)

    const topUsers = usersSatisfactionCnt.slice(0, 9)
    const result = topUsers.map((user) => ({
      username: user.username,
      profileImg: user.profileImg,
    }))

    return result
  }

  //유저 프로필 조회
  async getUserProfile(userId) {
    const user = await this.User.findById(userId).select(
      "username profileImg intro"
    )

    if (!user) {
      throw new Error("유저를 찾을 수 없음")
    }

    return user
  }

  //유저 프로필 업데이트
  async updateUserProfile(userId, updatedData) {
    const updatedUser = await this.User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("username profileImg intro")

    if (!updatedUser) {
      throw new Error("유저를 찾을 수 없음")
    }

    return updatedUser
  }
}

export default ProfileService
