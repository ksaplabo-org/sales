const sequelize = require("sequelize");
const Op = sequelize.Op;
const OrdersRepository = require("../db/orders");
const ClientsRepository = require("../db/clients");
const ProductsRepository = require("../db/products");

/**
 * 受注情報の全件検索処理
 *
 * @param {*} db
 * @returns {Promise<Object>}
 */
module.exports.getAll = async function (db) {
  try {
    // 受注情報の定義を取得
    const ordersModel = OrdersRepository.getOrdersModel(db);
    // 受注情報を全件取得
    return await ordersModel.findAll({
      order: [["orderNo", "ASC"]],
    });
  } catch (e) {
    throw e;
  }
};

//受注情報登録
module.exports.create = async function (
  db,
  clientNo,
  orderDate,
  shipDate,
  deliverDate,
  productCode,
  amount,
  updateId,
  entryId
) {
  const ordersModel = OrdersRepository.getOrdersModel(db);

  try {
    let orderNo = "";
    const limitMs=false;
    const latestOrderNo = await ordersModel.max("order_no");
    const date = new Date();
    const month = date.getMonth() + 1;
    const nowDate = date.getFullYear() + month.toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0");

    if (String(latestOrderNo).substring(0, 8) == nowDate) {
      if (String(latestOrderNo).substring(8) != "99") {
       orderNo = parseInt(latestOrderNo) + 1;    
      }
    } else {
      orderNo = nowDate + "01";
    }
    if (String(latestOrderNo).substring(8) != "99") {
      return await ordersModel.create({
        order_no: orderNo,
        client_no: clientNo,
        order_date: orderDate,
        ship_date: shipDate,
        deliver_date: deliverDate,
        product_code: productCode,
        amount: amount,
        update_id: updateId,
        update_date: sequelize.fn("now"),
        entry_id: entryId,
        entry_date: sequelize.fn("now"),
      });
    }
    return false;
  } catch (e) {
    throw e;
  }
};
