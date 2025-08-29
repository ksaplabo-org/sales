const sequelize = require("sequelize");
const Op = sequelize.Op;

const UserRepository = require("../db/clients");

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
 * @returns {promise<void}
 */
module.exports.edit = async function (db,clientNo,name,postCode,address1,address2,telNo,updateId,updateDate) {
    const clientsModel = clientsRepository.getclientsModel(db);
}