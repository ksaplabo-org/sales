const sequelize = require("sequelize");
const Op = sequelize.Op;
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
    const tmpOrders = await ordersModel.findAll();
    //受注番号の0埋め処理
    const orders = tmpOrders.map((order) => {
      return {
        order_no: order.order_no,
        // 0埋めされた表示用の受注番号
        client_noForDisplay: String(order.client_no).padStart(8, "0"),
        order_date: order.order_date,
        ship_date: order.ship_date,
        deliver_date: order.deliver_date,
      };
    });

    return orders;
  } catch (e) {
    throw e;
  }
};
