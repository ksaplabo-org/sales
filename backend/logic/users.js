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
 * 最新の管理用IDを取得
 */
module.exports.getMaxId = async function (db) {
  const usersModel = UsersRepository.getUsersModel(db);
  try {
    return await usersModel.max("id");
  } catch (e) {
    throw e;
  }
};

/**
 * ユーザー情報を登録
 */
module.exports.create = async function (db, id, userId, userPass, userName, userRole, updateId, entryId) {
  const usersModel = UsersRepository.getUsersModel(db);

  try {
    // 登録・更新日
    const timestamp = sequelize.fn("now");

    // ユーザー情報登録
    return await usersModel.create({
      id: id,
      user_id: userId,
      user_name: userName,
      user_pass: userPass,
      user_role: userRole,
      update_id: updateId,
      update_date: timestamp,
      entry_id: entryId,
      entry_date: timestamp,
    });
  } catch (e) {
    throw e;
  }
};

/**
 * ユーザー情報の全件検索処理
 */
module.exports.getAll = async function (db) {
  try {
    // ユーザー情報の定義を取得
    const usersModel = UsersRepository.getUsersModel(db);

    // ユーザー情報を全件取得
    return await usersModel.findAll();
  } catch (e) {
    throw e;
  }
};
