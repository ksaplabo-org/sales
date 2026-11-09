import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import userRepository from "../repositories/userRepository.js";

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
   * @param {*} userId 詳細取得対象のユーザーID
   * @param {*} loginId ログインユーザーID
   * @param {*} loginRole ログインユーザー権限
   * @returns ユーザー情報詳細
   */
  async findById(userId, loginId, loginRole) {
    const user = await userRepository.findById(userId);
    if (!user || user.delFlg) {
      throw new NotFoundError();
    }
    // 権限が一般であるユーザーの本人チェック
    if (loginRole == 1 && userId !== loginId) {
      throw new ForbiddenError();
    }
    return user;
  }

  /**
   * ユーザー情報登録
   *
   * @param {*} userInfo ユーザー情報
   * @param {*} loginId ログインユーザーID
   */
  async create(userInfo, loginId) {
    // 一意性制約チェック
    const user = await userRepository.findById(userInfo.userId);
    if (user) {
      throw new UniqueConstraintError();
    }

    // 登録者ID・更新者IDの設定
    userInfo.createdId = loginId;
    userInfo.updatedId = loginId;

    // 登録日時・更新日時の設定
    const now = new Date().toISOString();
    userInfo.createdAt = now;
    userInfo.updatedAt = now;

    await userRepository.create(userInfo);
  }

  /**
   * ユーザー情報更新
   *
   * @param {*} userId 更新対象のユーザーID
   * @param {*} userInfo 更新対象のユーザー情報
   * @param {*} loginId ログインユーザーID
   * @param {*} loginRole ログインユーザー権限
   */
  async update(userId, userInfo, loginId, loginRole) {
    // 更新データの存在チェック
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }
    // 権限が一般であるユーザーの本人チェック
    if (loginRole == 1 && userId !== loginId) {
      throw new ForbiddenError();
    }

    // 更新者IDの設定
    userInfo.updatedId = loginId;

    // 更新日時の設定
    const now = new Date().toISOString();
    userInfo.updatedAt = now;

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
