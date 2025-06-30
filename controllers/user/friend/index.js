import FriendService from "../../../services/user/friend/index.js"
import User from "../../../models/user/User.js"
import { sendNotification } from "../../../firebase/fcm.js"
const friendService = new FriendService({
  User,
  sendNotification,
})

export const sendFriendRequest = async (req, res) => {
  const userId = req.user.userId
  const friendId = req.body.friendId

  try {
    const result = await friendService.sendFriendRequest({ userId, friendId })

    return res.status(200).json({
      success: true,
      message: "친구 요청이 성공적으로 전송되었습니다.",
      data: result,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "친구 요청 중 오류가 발생했습니다.",
    })
  }
}

export const acceptFriendRequest = async (req, res) => {
  const { userId, requesterId } = req.body

  try {
    const result = await friendService.acceptFriendRequest({
      userId,
      requesterId,
    })
    return res.status(200).json({
      success: true,
      message: "친구 요청을 수락했습니다.",
      data: result,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "친구 요청 수락 중 오류가 발생했습니다.",
    })
  }
}

export const removeFriends = async (req, res) => {
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
