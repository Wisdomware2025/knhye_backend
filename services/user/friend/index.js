class FriendService {
  constructor({ User }) {
    this.User = User
  }

  async addFriends({ userId, friendId }) {
    const user = await this.User.findById(userId)
    const friend = await this.User.findById(friendId)

    if (!user || !friend) {
      throw { status: 404, message: "사용자를 찾을 수 없음" }
    }

    if (user.friends.includes(friendId)) {
      throw { status: 400, message: "이미 친구인 상태" }
    }

    user.friends.push(friendId)
    friend.friends.push(userId)
    await user.save()
    await friend.save()

    return true
  }

  async removeFriends({ userId, friendId }) {
    const user = await this.User.findById(userId)
    const friend = await this.User.findById(friendId)

    if (!user || !friend) {
      throw { status: 404, message: "사용자를 찾을 수 없음" }
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId)
    friend.friends = friend.friends.filter((id) => id.toString() !== userId)

    await user.save()
    await friend.save()

    return true
  }

  async getFriendsCnt(userId) {
    const user = await this.User.findById(userId)
    if (!user) throw { status: 404, message: "친구가 없음" }

    return user.friends.length
  }
}

export default FriendService
