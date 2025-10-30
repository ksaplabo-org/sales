const UsersRepository = require("../db/users");
const sequelize = require("sequelize");

/**
 * ユーザー情報を取得
 *
 * [検索条件]
 * ユーザーIDの完全一致
 *
 * @param {*} db
 * @param {*} userId
 * @returns {Promise<Object>}
 */
module.exports.findByUserId = async function (db, userId) {
  // ユーザー情報の定義を取得
  const usersModel = UsersRepository.getUsersModel(db);
  try {
    // ユーザーIDに合致するユーザーを検索
    return await usersModel.findOne({
      where: {
        user_id: userId,
      },
    });
  } catch (e) {
    throw e;
  }
};

/**
 * ユーザー情報を管理用IDで取得
 */
module.exports.findById = async function (db, id) {
  //ユーザー情報の定義を取得
  const usersModel = UsersRepository.getUsersModel(db);

  try {
    return await usersModel.findByPk(id);
  } catch (e) {
    throw e;
  }
};

/**
 * ユーザー情報修正
 */
module.exports.edit = async function (db, id, userId, userPass, userName, userRole, updateId) {
  //ユーザー情報の定義を取得
  const usersModel = UsersRepository.getUsersModel(db);

  try {
    await usersModel.update(
      {
        user_id: userId,
        user_pass: userPass,
        user_name: userName,
        user_role: userRole,
        update_id: updateId,
        update_date: sequelize.fn("now"),
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};
