const sequelize = require("sequelize");

const ClientsRepository = require("../db/clients");

/**
 * 顧客情報の全件検索処理
 *
 * @param {*} db
 * @returns {Promise<Object>}
 */
module.exports.getAll = async function (db) {
  try {
    // 顧客情報の定義を取得
    const clientsModel = ClientsRepository.getClientsModel(db);

    // 顧客情報を全件取得
    return await clientsModel.findAll();
  } catch (e) {
    throw e;
  }
};

/**
 * 顧客番号の最大値検索
 *
 * @param {*} db
 * @returns {Promise<number>}
 */
module.exports.getMaxClientNo = async function (db) {
  const clientsModel = ClientsRepository.getClientsModel(db);

  try {
    // 顧客番号の最大値を取得
    return await clientsModel.max("client_no");
  } catch (e) {
    throw e;
  }
};

/**
 * 顧客情報を登録
 *
 * @param {*} db
 * @param {*} clientNo
 * @param {*} name
 * @param {*} postCode
 * @param {*} address1
 * @param {*} address2
 * @param {*} telNo
 * @param {*} updateId
 * @param {*} entryId
 * @returns {Promise<void>}
 */
module.exports.create = async function (db, clientNo, name, postCode, address1, address2, telNo, updateId, entryId) {
  const clientsModel = ClientsRepository.getClientsModel(db);

  try {
    return await clientsModel.create({
      client_no: clientNo,
      name: name,
      post_code: postCode,
      address1: address1,
      address2: address2,
      tel_no: telNo,
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
 * 顧客情報を編集
 *
 * @param {*} db
 * @param {*} clientNo
 * @param {*} name
 * @param {*} postCode
 * @param {*} address1
 * @param {*} address2
 * @param {*} telNo
 * @param {*} updateId
 * @param {*} updateDate
 * @returns {Promise<void>}
 */
module.exports.edit = async function (db, clientNo, name, postCode, address1, address2, telNo, updateId) {
  const clientsModel = ClientsRepository.getClientsModel(db);

  try {
    await clientsModel.update(
      {
        name: name,
        post_code: postCode,
        address1: address1,
        address2: address2,
        tel_no: telNo,
        update_id: updateId,
        update_date: sequelize.fn("now"),
      },
      {
        where: {
          client_no: clientNo,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

/**
 * 顧客情報削除
 */
module.exports.delete = async function (db, clientNo) {
  const clientsModel = ClientsRepository.getClientsModel(db);
  try {
    await clientsModel.destroy({
      where: {
        client_no: clientNo,
      },
    });
  } catch (e) {
    throw e;
  }
};

/**
 * 顧客情報を取得
 *
 * [検索条件]
 * 顧客番号の完全一致
 *
 * @param {*} db
 * @param {*} clientNo
 * @returns {Promise<Object>}
 */
module.exports.findByClientNo = async function (db, clientNo) {
  //顧客情報の定義を取得
  const clientsModel = ClientsRepository.getClientsModel(db);

  try {
    return await clientsModel.findByPk(clientNo);
  } catch (e) {
    throw e;
  }
};
