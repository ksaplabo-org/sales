const sequelize = require("sequelize");
const ProductsRepository = require("../db/products");
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
 * 商品情報削除
 */
module.exports.delete = async function (db, productCode) {
  const productsModel = ProductsRepository.getProductsModel(db);
  try {
    await productsModel.destroy({
      where: {
        product_code: productCode,
      },
    });
  } catch (e) {
    throw e;
  }
};
