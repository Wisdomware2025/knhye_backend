import FriendService from "../../services/user/friend"

const friendService = new FriendService({
  User,
})

export const addNewFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params
    const isConnected = await friendService.addFriends({ userId, friendId })

    if (!isConnected) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    return res.status(200).json({ message: "친구 추가됨" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params
    const isRemoved = await friendService.removeFriends({ userId, friendId })

    if (!isRemoved) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    return res.status(200).json({ message: "친구 삭제됨" })
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" })
  }
}

export const getFriendsCnt = async (req, res) => {
  try {
    const { userId } = req.params
    const friends = await friendService.getFriendsCnt({ userId })

    return res.status(200).json(friends)
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "서버 오류" })
  }
}
