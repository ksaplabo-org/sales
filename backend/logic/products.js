const sequelize = require("sequelize");
const Op = sequelize.Op;
const ProductsRepository = require("../db/products");

/**
 * 商品情報の全件検索処理
 *
 */
module.exports.getAll = async function (db) {
  // 商品情報の定義を取得
  const productsModel = ProductsRepository.getProductsModel(db);
  try {
    // 商品情報を全件取得
    return await productsModel.findAll();
  } catch (e) {
    throw e;
  }
};

/**
 * 商品情報を商品コードを元に取得
 */
module.exports.findByProductCode = async function (db, productCode) {
  //商品情報の定義を取得
  const productsModel = ProductsRepository.getProductsModel(db);
  try {
    // 商品コードと一致する商品情報を取得
    return await productsModel.findByPk(productCode);
  } catch (e) {
    throw e;
  }
};
