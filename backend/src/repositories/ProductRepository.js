import { col, fn, literal, Op } from "sequelize";
import ProductModel from "../models/ProductModel.js";

class ProductRepository {
  /**
   * 商品情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 商品情報一覧
   */
  async findAll(condition) {
    // 検索条件を作成
    const where = {};
    if (condition.orderKbn) {
      where.orderKbn = condition.orderKbn;
    }
    if (condition.productCode) {
        where.productCode = { [Op.eq]: condition.productCode};
    }
    if (condition.productName) {
      where.productName = { [Op.like]: "%" + condition.productName + "%"};
    }
    if (condition.productPriceLow || condition.productPriceHigh) {
      if (condition.productPriceLow && !condition.productPriceHigh) {
        where.productPrice = { [Op.gte]: condition.productPriceLow};
      }
      else if (!condition.productPriceLow && condition.productPriceHigh) {
        where.productPrice = { [Op.lte]: condition.productPriceHigh};
      }
      where.productPrice = { [Op.gte]: condition.productPriceLow, [Op.lte]: condition.productPriceHigh}; 
    }


    // 検索結果を返却
    return await ProductModel.findAll({
      attributes: [
        ["product_code", "productCode"],
        ["product_name", "productName"],
        "orderKbn",
        ["order_client_code", "orderClientCode"],
        ["product_price", "productPrice"],
        [literal('EXISTS(SELECT 1 FROM orders o WHERE o.product_code = ProductModel.product_code)'),'usedFlg']
      ],
      where: where,
    });
  }
}

export default new ProductRepository();