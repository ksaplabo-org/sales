const sequelize = require("sequelize");
const Op = sequelize.Op;
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
 *
 */
module.exports.create = async function (db, productName, price, updateId, entryId) {
  const productsModel = ProductsRepository.getProductsModel(db);

  try {
    const productCode = (await productsModel.max("product_code")) + 1;
    if (String(productCode).length > 7) {
      const status = 400;
      return status;
    }
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
