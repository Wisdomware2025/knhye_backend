import { findById, findByIdAndUpdate } from "../../../models/User.js"

class ProfileService {
  //유저 프로필 조회
  async getUserProfile(userId) {
    return await findById(userId).select("username profileImg intro")
  }

  //유저 프로필 업데이트
  async updateUserProfile(userId, updatedData) {
    return await findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("username profileImg intro")
  }
}
