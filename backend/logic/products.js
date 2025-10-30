const ProductsRepository = require("../db/products");
const sequelize = require("sequelize");

/**
 * 商品情報の全件検索処理
 *
 * @param {*} db
 * @returns {Promise<Object[]>}
 */
module.exports.getAll = async function (db) {
  try {
    // 商品情報の定義を取得
    const productsModel = ProductsRepository.getProductsModel(db);

    // 商品情報を全件取得
    return await productsModel.findAll();
  } catch (e) {
    throw e;
  }
};

/**
 * 商品情報を取得
 *
 * [検索条件]
 * 商品コードの完全一致
 *
 * @param {*} db
 * @param {*} productCode
 * @returns {Promise<Object>}
 */
module.exports.findByProductCode = async function (db, productCode) {
  //商品情報の定義を取得
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
      update_date: sequelize.fn("now"),
      entry_id: entryId,
      entry_date: sequelize.fn("now"),
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
