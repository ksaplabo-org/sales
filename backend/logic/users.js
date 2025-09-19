const UsersRepository = require("../db/users");

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
      }
    });
  } catch (e) {
    throw e;
  }
};

