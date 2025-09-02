const { where } = require("sequelize/lib/sequelize");
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
    const tmpClients = await clientsModel.findAll();
    //顧客番号の0埋め処理
    const clients = tmpClients.map((client) => {
      return {
        client_no: client.client_no,
        // 0埋めされた表示用の顧客番号
        client_noForDisplay: String(client.client_no).padStart(8, "0"),
        name: client.name,
        post_code: client.post_code,
        address1: client.address1,
        address2: client.address2,
        tel_no: client.tel_no,
      };
    });

    return clients;
  } catch (e) {
    throw e;
  }
};
