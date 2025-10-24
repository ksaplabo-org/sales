const sequelize = require("sequelize");
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
    return await ordersModel.findAll();
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
 * 受注情報修正
 */
module.exports.edit = async function (db, orderNo, orderDate, shipDate, deliverDate, productCode, amount, updateId) {
  // 受注情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);

  try {
    // 伝票番号と一致する受注情報を修正
    await ordersModel.update(
      {
        order_no: orderNo,
        order_date: orderDate,
        ship_date: shipDate,
        deliver_date: deliverDate,
        product_code: productCode,
        amount: amount,
        update_id: updateId,
        update_date: sequelize.fn("now"),
      },
      {
        where: {
          order_no: orderNo,
        },
      }
    );
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

/**
 * 月間の受注情報を取得
 */
module.exports.findByOrderDateYM = async function (db, OrderDateYM) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  // モデル間の関連付け(受注に顧客・商品情報を紐づけ)
  ordersModel.associate(clientsModel, productsModel);

  // 取得する範囲の両端を変数にセット
  const startDate = new Date(OrderDateYM);
  const endDate = new Date(OrderDateYM);
  endDate.setMonth(endDate.getMonth() + 1); // 取得した年月の翌月に設定(12+1月は来年の1月に繰り越し)

  try {
    return await ordersModel.findAll({
      where: {
        order_date: {
          // yyyy年mm月01日以上、yyyy年mm+1月01日未満の範囲
          [sequelize.Op.gte]: startDate,
          [sequelize.Op.lt]: endDate,
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
