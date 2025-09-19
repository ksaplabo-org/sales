const UsersRepository = require("../db/users");
const sequelize = require("sequelize");
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
 * ユーザー情報を登録
 */
module.exports.create = async function (db, userId, userPass, userName, userRole, updateId, entryId) {
  const usersModel = UsersRepository.getUsersModel(db);

  try {
    // 管理用IDの自動採番(最新IDに+1)
    const id = (await usersModel.max("id")) + 1;
    // ユーザー情報登録
    return await usersModel.create({
      id: id,
      user_id: userId,
      user_name: userName,
      user_pass: userPass,
      user_role: userRole,
      update_id: updateId,
      update_date: sequelize.fn("now"),
      entry_id: entryId,
      entry_date: sequelize.fn("now"),
    });
  } catch (e) {
    throw e;
  }
};

/**
 * ユーザー情報の全件検索処理
 *
 * @param {*} db
 * @returns {Promise<Object>}
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


/**
 * ユーザー情報を取得
 *
 * [検索条件]
 * 管理用IDの完全一致
 *
 * @param {*} db
 * @param {*} id
 * @returns {Promise<Object>}
 */
module.exports.findByid = async function (db, id) {
  //顧客情報の定義を取得
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

/**
 * ユーザー情報削除
 */
module.exports.delete = async function (db, id) {
  const usersModel = UsersRepository.getUsersModel(db);
  try {
    await usersModel.destroy({
      where: {
        id: id,
      },
    });
  } catch (e) {
    throw e;
  }
};