const sequelize = require("sequelize");
const Op = sequelize.Op;
const ClientsRepository = require("../db/clients");



/**
 * 顧客情報を取得
 *
 * [検索条件]
 * ユーザーIDの完全一致
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

/**
 * 顧客情報削除
 */
module.exports.delete = async function (db, clientNo) {
  const clientsModel = ClientsRepository.getClientsModel(db);
  console.log(clientNo);
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
