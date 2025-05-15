import FriendService from "../../../services/user/friend"
import User from "../../../models/user/User"

const friendService = new FriendService({
  User,
})

export const addFriends = async (req, res) => {
  try {
    const userId = req.params.userId
    const friendId = req.params.friendId

    await friendService.addFriends({ userId, friendId })

    res.status(201).json({ message: "친구 추가 완료" })
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const removeFriends = async (req, res) => {
  try {
    const userId = req.params.userId
    const friendId = req.params.friendId

    await friendService.removeFriends({
      userId,
      friendId,
    })

    res.status(200).json({ message: "친구 삭제 완료" })
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}

export const getFriendsCnt = async (req, res) => {
  try {
    const userId = req.params.userId

    const cnt = await friendService.getFriendsCnt(userId)

    res.status(200).json(cnt)
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).json({ message: "서버 오류" })
  }
}
