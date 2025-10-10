const { Op } = require("sequelize");
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
 * 月間の受注情報を取得
 */
module.exports.findByYearMonth = async function (db, yearMonth) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  // モデル間の関連付け(受注に顧客・商品情報を紐づけ)
  ordersModel.associate(clientsModel, productsModel);

  // 取得する範囲の両端を変数にセット
  const startDate = new Date(yearMonth);
  const endDate = new Date(yearMonth);
  endDate.setMonth(endDate.getMonth() + 1); // 取得した年月の翌月に設定(12+1月は来年の1月に繰り越し)

  try {
    return await ordersModel.findAll({
      where: {
        order_date: {
          // yyyy年mm月01日以上、yyyy年mm+1月01日未満の範囲
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
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
