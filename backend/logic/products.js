const ProductsRepository = require("../db/products");

/**
 * 顧客情報の全件検索処理
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
 * 顧客情報を取得
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
