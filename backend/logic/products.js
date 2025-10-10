const {fn} = require("sequelize");
const ProductsRepository = require("../db/products");

/**
 * 商品情報の全件検索処理
 *
 * @param {*} db
 * @returns {Promise<Object>}
 */
module.exports.getAll = async function (db) {
  try {
    // 顧客情報の定義を取得
    const productsModel = ProductsRepository.getProductsModel(db);

    // 顧客情報を全件取得
    const products = await productsModel.findAll();

    return products;
  } catch (e) {
    throw e;
  }
};

/**
 * 商品情報を取得
 *
 * [検索条件]
 * ユーザーIDの完全一致
 *
 * @param {*} db
 * @param {*} productNo
 * @returns {Promise<Object>}
 */
module.exports.findByProductCode = async function (db, productCode) {
  //顧客情報の定義を取得
  const productsModel = ProductsRepository.getProductsModel(db);

  try {
    return await productsModel.findByPk(productCode);
  } catch (e) {
    throw e;
  }
};

/**
 * 商品情報を登録
 */
module.exports.create = async function (db, productCode, productName, price, updateId, entryId) {
  const productsModel = ProductsRepository.getProductsModel(db);

  try {
    return await productsModel.create({
      product_code: productCode,
      product_name: productName,
      price: price,
      update_id: updateId,
      update_date: fn("now"),
      entry_id: entryId,
      entry_date: fn("now"),
    });
  } catch (e) {
    throw e;
  }
};

/**
 * 商品コードの最新の値を検索
 */
module.exports.getLatestProductCode = async function (db) {
  const productsModel = ProductsRepository.getProductsModel(db);

  try {
    // 商品コードの最大値を取得
    return await productsModel.max("product_code");
  } catch (e) {
    throw e;
  }
};
