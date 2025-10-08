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
    return ordersModel.findAll();
  } catch (e) {
    throw e;
  }
};

/**
 * 受注情報を取得
 *
 * [検索条件]
 * 伝票番号の完全一致
 *
 * @param {*} db
 * @param {*} orderNo
 * @returns {Promise<Object>}
 */
module.exports.findByOrderNo = async function (db, orderNo) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  // モデル間の関連付け(受注に顧客・商品情報を紐づけ)
  ordersModel.associate(clientsModel, productsModel);

  try {
    // 伝票番号と一致する受注情報を取得
    return await ordersModel.findOne({
      where: {
        order_no: orderNo,
      },
      // 内部結合処理
      include: [
        {
          model: clientsModel,
          required: true,
        },
        {
          model: productsModel,
          required: true,
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};

/**
 * 受注情報削除
 */
module.exports.delete = async function (db, orderNo) {
  const ordersModel = OrdersRepository.getOrdersModel(db);
  try {
    await ordersModel.destroy({
      where: {
        order_no: orderNo,
      },
    });
  } catch (e) {
    throw e;
  }
};
