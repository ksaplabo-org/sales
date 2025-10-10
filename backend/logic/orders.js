const sequelize = require("sequelize");
const OrdersRepository = require("../db/orders");

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
    return ordersModel.findAll();
  } catch (e) {
    throw e;
  }
};

//受注情報登録
module.exports.create = async function (
  db,
  orderNo,
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
  } catch (e) {
    throw e;
  }
};

/**
 * 伝票番号の最新の値を検索
 *
 * @param {*} db
 * @returns {Promise<string>}
 */
module.exports.getLatestOrderNo = async function (db) {
  const ordersModel = OrdersRepository.getOrdersModel(db);

  try {
    // 伝票番号の最大値を取得
    return await ordersModel.max("order_no");
  } catch (e) {
    throw e;
  }
};
