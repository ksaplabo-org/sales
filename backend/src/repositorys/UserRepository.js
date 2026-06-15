import { literal, Op } from "sequelize";
import UserModel from "../models/UserModel.js";

class UserRepository {
  async find(condition) {
    const where = {};
    if (condition.userId) {
      where.user_id = { [Op.like]: "%" + condition.userId + "%" };
    }
    if (condition.userName) {
      where.user_name = { [Op.like]: "%" + condition.userName + "%" };
    }
    if (condition.role) {
      where.role = condition.role;
    }
    if (!condition.includeDeleted) {
      where.delete_flg = false;
    }
    return await UserModel.findAll({
      attributes: [
        ["user_id", "userId"],
        ["user_name", "userName"],
        "password",
        "role",
        "address",
        "birthday",
        [literal("TIMESTAMPDIFF(YEAR, birthday, CURDATE())"), "age"],
        ["created_at", "createdAt"],
        ["updated_at", "updatedAt"],
        ["delete_flg", "deleteFlg"],
      ],
      where: where,
    });
  }

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
