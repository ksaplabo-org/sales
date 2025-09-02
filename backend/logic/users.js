const UserRepository = require("../db/users");

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
module.exports.findById = async function (db, userId) {
  // ユーザー情報の定義を取得
  const userModel = UserRepository.getUsersModel(db);

  try {
    return await userModel.findByPk(userId);
  } catch (e) {
    throw e;
  }
};
