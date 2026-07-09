import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import userRepository from "../repositories/UserRepository.js";

class UserService {
  /**
   * ユーザー情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns ユーザー情報一覧
   */
  async findAll(condition) {
    return await userRepository.findAll(condition);
  }

  /**
   * ユーザー情報詳細取得
   *
   * @param {*} id ユーザーID
   * @returns ユーザー情報詳細
   */
  async findById(id) {
    const user = await userRepository.findById(id);
    if (!user || user.delFlg) {
      throw new NotFoundError();
    }
    return user;
  }

  /**
   * ユーザー情報登録
   *
   * @param {*} userInfo ユーザー情報
   */
  async create(userInfo) {
    // 一意性制約チェック
    const user = await userRepository.findById(userInfo.userId);
    if (user) {
      throw new UniqueConstraintError();
    }

    await userRepository.create(userInfo);
  }

  /**
   * ユーザー情報更新
   *
   * @param {*} userId ユーザーID
   * @param {*} userInfo ユーザー情報
   */
  async update(userId, userInfo) {
    // 更新データの存在チェック
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }
    await userRepository.update(userId, userInfo);
  }

  /**
   * ユーザー情報論理削除
   *
   * @param {*} userId ユーザーID
   */
  async delete(userId) {
    // 削除データの存在チェック
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    await userRepository.delete(userId);
  }
}

export default new UserService();
