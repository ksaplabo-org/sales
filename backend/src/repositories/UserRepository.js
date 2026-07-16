import { col, fn, literal, Op } from "sequelize";
import UserModel from "../models/UserModel.js";

class UserRepository {
  /**
   * ユーザー情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns ユーザー情報一覧
   */
  findAll = async (condition) => {
    // 検索条件を作成
    const where = {};
    if (condition.userId) {
      where.userId = { [Op.like]: "%" + condition.userId + "%" };
    }
    if (condition.userName) {
      where[Op.or] = [
        { lastName: { [Op.like]: "%" + condition.userName + "%" } },
        { firstName: { [Op.like]: "%" + condition.userName + "%" } },
      ];
    }
    if (condition.role) {
      where.role = condition.role;
    }
    if (!condition.includeDeleted) {
      where.delFlg = false;
    }

    // 検索結果を返却
    return await UserModel.findAll({
      attributes: [
        ["user_id", "userId"],
        ["last_name", "lastName"],
        ["first_name", "firstName"],
        [fn("CONCAT", col("last_name"), " ", col("first_name")), "fullName"],
        "role",
        "birthday",
        [literal("TIMESTAMPDIFF(YEAR, birthday, CURDATE())"), "age"],
        ["del_flg", "delFlg"],
      ],
      where: where,
    });
  };

  /**
   * ユーザー情報詳細取得
   *
   * @param {*} id ユーザーID
   * @returns ユーザー情報
   */
  findById = async (id) => {
    return await UserModel.findByPk(id);
  };

  /**
   * ユーザー情報登録
   *
   * @param {*} userInfo ユーザー情報
   */
  create = async (userInfo) => {
    await UserModel.create(userInfo);
  };

  /**
   * ユーザー情報更新
   *
   * @param {*} userId ユーザーID
   * @param {*} userInfo ユーザー情報
   */
  update = async (userId, userInfo) => {
    await UserModel.update(userInfo, {
      where: {
        userId: userId,
      },
    });
  };

  /**
   * ユーザー情報論理削除
   *
   * @param {*} userId ユーザーID
   */
  delete = async (userId) => {
    await UserModel.update(
      { delFlg: true },
      {
        where: {
          userId: userId,
        },
      },
    );
  };
}

export default new UserRepository();
