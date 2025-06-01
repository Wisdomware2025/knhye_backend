class ProfileService {
  constructor({ User }) {
    this.User = User
  }
  //유저 프로필 조회
  async getUserProfile(userId) {
    return await this.User.findById(userId).select("username profileImg intro")
  }

  //유저 프로필 업데이트
  async updateUserProfile(userId, updatedData) {
    return await this.User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("username profileImg intro")
  }
}

export default ProfileService
