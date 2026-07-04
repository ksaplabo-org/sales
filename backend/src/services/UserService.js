import UserRepository from "../repositories/UserRepository.js";

class UserService {
  repository = new UserRepository();

  /**
   * ユーザー情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns ユーザー情報一覧
   */
  async find(condition) {
    return await this.repository.find(condition);
  }

  /**
   * ユーザー情報詳細取得
   *
   * @param {*} id ユーザーID
   * @returns ユーザー情報詳細
   */
  async findById(id) {
    const user = await this.repository.findById(id);
    if (!user || user.delFlg) {
      return null;
    }
    return user;
  }

  /**
   * ユーザー情報登録
   *
   * @param {*} userInfo ユーザー情報
   */
  async insert(userId) {
    await this.repository.insert(userId);
  }

  /**
   * ユーザー情報更新
   *
   * @param {*} userId ユーザーID
   * @param {*} userInfo ユーザー情報
   */
  async update(userId, userInfo) {
    await this.repository.update(userId, userInfo);
  }

  /**
   * ユーザー情報論理削除
   *
   * @param {*} userId ユーザーID
   */
  async delete(userId) {
    await this.repository.delete(userId);
  }
}

export default UserService;
