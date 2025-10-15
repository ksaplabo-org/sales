/**
 * 商品情報修正
 */
module.exports.edit = async function (db, productCode, productName, price, updateId) {
  const productsModel = ProductsRepository.getProductsModel(db);

  try {
    await productsModel.update(
      {
        product_name: productName,
        price: price,
        update_id: updateId,
        update_date: sequelize.fn("now"),
      },
      {
        where: {
          product_code: productCode,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};
