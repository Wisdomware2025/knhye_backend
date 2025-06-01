import User from "../../../models/user/User.js"
import ProfileService from "../../../services/user/profile/index.js"

const profileService = new ProfileService({
  User,
})

// 유저 프로필 조회
export async function getProfile(req, res) {
  try {
    const userId = req.params.userId
    const user = await profileService.getUserProfile(userId)
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "프로필 조회 실패" })
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

    res.status(200).json(updatedUser)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "업데이트 실패: " })
  }
}
