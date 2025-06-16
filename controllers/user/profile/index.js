import User from "../../../models/user/User.js"
import ProfileService from "../../../services/user/profile/index.js"

const profileService = new ProfileService({
  User,
})

export async function getFamousUsers(req, res) {
  try {
    const role = req.params
    const famousUsers = await profileService.getFamousUsers(role)

    if (!famousUsers) {
      return res.status(404).json({ message: "유저를 찾을 수 없음" })
    }

    return res.status(200).json(famousUsers)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "서버 오류" })
  }
}

// 유저 프로필 조회
export async function getProfile(req, res) {
  try {
    const userId = req.params.userId
    const user = await profileService.getUserProfile(userId)

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." })
    }
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "프로필 조회 실패" })
  }
}

// 유저 프로필 수정 조회
// export async function getProfileSetting(req, res) {
//   try {
//     const user = await UserService.getUserProfile(req.user.id)
//     res.status(200).json(user)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: "프로필 설정 조회 실패" })
//   }
// }

//유저 프로필 수정
export async function updateProfileSetting(req, res) {
  try {
    const userId = req.params.userId
    const { username, profileImg, intro } = req.body
    const updatedUser = await profileService.updateUserProfile(userId, {
      username,
      profileImg,
      intro,
    })

    if (!updatedUser) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." })
    }

    return res.status(200).json(updatedUser)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: "업데이트 실패: " })
  }
}
