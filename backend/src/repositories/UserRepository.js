import { col, fn, literal, Op } from "sequelize";
import UserModel from "../models/UserModel.js";

class UserRepository {
  async find(condition) {
    // 検索条件を作成
    const where = {};
    if (condition.userId) {
      where.user_id = { [Op.like]: "%" + condition.userId + "%" };
    }
    if (condition.userName) {
      where.last_name = { [Op.like]: "%" + condition.userName + "%" };
      where.first_name = { [Op.like]: "%" + condition.userName + "%" };
    }
    if (condition.role) {
      where.role = condition.role;
    }
    if (!condition.includeDeleted) {
      where.del_flg = false;
    }

    // 検索結果を返却
    return await UserModel.findAll({
      attributes: [
        ["user_id", "userId"],
        ["last_name", "lastName"],
        ["first_name", "firstName"],
        [fn("CONCAT", col("last_name"), " ", col("first_name")), "fullName"],
        "password",
        "role",
        "birthday",
        [literal("TIMESTAMPDIFF(YEAR, birthday, CURDATE())"), "age"],
        ["created_id", "createdId"],
        ["created_at", "createdAt"],
        ["updated_id", "updatedId"],
        ["updated_at", "updatedAt"],
        ["del_flg", "delFlg"],
      ],
      where: where,
    });
  }

  /**
   * ユーザーIDから検索
   * 
   * @param {*} id ユーザーID
   * @returns ユーザー情報
   */
  async findById(id) {
    return await UserModel.findByPk(id);
  }

  /**
   * ユーザー削除
   *
   * @param {*} userId ユーザーID
   */
  async delete(userId) {
    await UserModel.destroy({
      where: {
        user_id: userId,
      },
    });
  }
}

export default UserRepository;
