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
 */
module.exports.findByOrderNo = async function (db, orderNo) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  // モデル間の関連付け(受注に顧客・商品情報を紐づけ)
  ordersModel.associate(clientsModel, productsModel);

  try {
    return await ordersModel.findOne({
      where: {
        order_no: orderNo,
      },
      // 内部結合処理
      include: [
        {
          required: true,
          model: clientsModel,
        },
        {
          required: true,
          model: productsModel,
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};
