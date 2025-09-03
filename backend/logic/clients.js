const sequelize = require("sequelize");
const Op = sequelize.Op;
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

module.exports.create = async function (db, name, postCode, address1, address2, telNo, updateId, entryId) {
  const clientsModel = ClientsRepository.getClientsModel(db);

  try {
    const clientNo = (await clientsModel.max("client_no")) + 1;

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
    console.log("errtest");
    throw e;
  }
};

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
 * 顧客情報修正
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
