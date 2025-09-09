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
