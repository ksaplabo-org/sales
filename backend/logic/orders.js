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
    return await ordersModel.findAll();
  } catch (e) {
    throw e;
  }
};

/**
 * 受注情報を取得
 *
 * [検索条件]
 * ユーザーIDの完全一致
 *
 * @param {*} db
 * @param {*} clientNo
 * @returns {Promise<Object>}
 */
module.exports.findByOrderNo = async function (db, orderNo) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  //受注情報に顧客・商品情報を結合する処理
  ordersModel.associate(clientsModel, productsModel);

  try {
    const order = await ordersModel.findOne({
      where: {
        order_no: orderNo,
      },
      // 顧客・商品情報から値を取得
      include: [
        {
          model: clientsModel,
        },
        {
          model: productsModel,
        },
      ],
    });

    return order;
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
    const latestOrderNo = await ordersModel.max("order_no");
    const date = new Date();
    const month = date.getMonth() + 1;
    const nowDate = date.getFullYear() + month.toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0");

    if (String(latestOrderNo).substring(0, 8) == nowDate) {
      if (String(latestOrderNo).substring(8) == "99") {
        return 400;
      } else {
        orderNo = parseInt(latestOrderNo) + 1;
      }
    } else {
      orderNo = nowDate + "01";
    }
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
 * 受注情報修正
 */
module.exports.edit = async function (db, orderNo, orderDate, shipDate, deliverDate, productCode, amount, updateId) {
  const ordersModel = OrdersRepository.getOrdersModel(db);

  try {
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
