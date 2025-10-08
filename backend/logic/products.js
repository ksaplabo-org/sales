const ProductsRepository = require("../db/products");

/**
 * 商品情報の全件検索処理
 *
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
