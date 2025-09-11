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

/**
 * 月間の受注情報を取得
 *
 * [検索条件]
 * ユーザーIDの完全一致
 *
 * @param {*} db
 * @param {*} clientNo
 * @returns {Promise<Object>}
 */
module.exports.findByYearMonth = async function (db, yearMonth) {
  //受注・顧客・商品情報の定義を取得
  const ordersModel = OrdersRepository.getOrdersModel(db);
  const clientsModel = ClientsRepository.getClientsModel(db);
  const productsModel = ProductsRepository.getProductsModel(db);

  // 取得する範囲の両端を変数にセット
  const startDate = new Date(yearMonth);
  const endDate = new Date(yearMonth);
  
  // 取得した年月の翌月に設定(12+1月は来年の1月に繰り越し)
  endDate.setMonth(endDate.getMonth() + 1);

  //受注情報に顧客・商品情報を結合する処理
  ordersModel.associate(clientsModel, productsModel);

  try {
    const orders = await ordersModel.findAll({
      where: {
        order_date: {
          // yyyy年mm月01日以上、yyyy年mm+1月01日未満の範囲
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
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

    return orders;
  } catch (e) {
    throw e;
  }
};

/*
 *受注情報登録
 */
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
  const statusCode = 400;
  try {
    let orderNo = "";
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
    return statusCode;
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
