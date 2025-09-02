const sequelize = require("sequelize");

const ClientsRepository = require("../db/clients");

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
