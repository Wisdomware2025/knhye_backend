class FriendService {
  constructor({ User }) {
    this.User = User
    this.sendNotification = this.sendNotification
  }

  async sendFriendRequest({ userId, friendId }) {
    const user = await this.User.findById(userId)
    const friend = await this.User.findById(friendId)

    if (!user || !friend) {
      throw { status: 404, message: "사용자를 찾을 수 없음" }
    }

    if (user.friends.includes(friendId)) {
      throw { status: 400, message: "이미 친구입니다" }
    }

    if (friend.friendRequests.includes(userId)) {
      throw { status: 400, message: "이미 요청을 보냈습니다" }
    }

    friend.friendRequests.push(userId)
    user.sentRequests.push(friendId)

    await friend.save()
    await user.save()

    await this.sendNotification({
      token: friend.fcmTokens,
      title: "새 친구 요청",
      body: `${user.username}님이 친구 요청을 보냈습니다.`,
    })

    return { success: true }
  }

  async acceptFriendRequest({ userId, requesterId }) {
    const user = await this.User.findById(userId)
    const requester = await this.User.findById(requesterId)

    if (!user || !requester) {
      throw { status: 404, message: "사용자를 찾을 수 없음" }
    }

    if (!user.friendRequests.includes(requesterId)) {
      throw { status: 400, message: "친구 요청이 없습니다" }
    }

    user.friends.push(requesterId)
    requester.friends.push(userId)

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    )
    requester.sentRequests = requester.sentRequests.filter(
      (id) => id.toString() !== userId
    )

    await user.save()
    await requester.save()

    await this.sendNotification({
      token: requester.fcmTokens,
      title: "친구 추가 완료",
      body: `${user.username}님과 친구가 되었습니다.`,
    })

    await this.sendNotification({
      token: user.fcmTokens,
      title: "친구 추가 완료",
      body: `${user.username}님과 친구가 되었습니다.`,
    })

    return { success: true }
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
