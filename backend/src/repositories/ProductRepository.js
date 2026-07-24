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
      where.productCode = { [Op.eq]: condition.productCode };
    }
    if (condition.productName) {
      where.productName = { [Op.like]: "%" + condition.productName + "%" };
    }
    if (condition.productPriceLow || condition.productPriceHigh) {
      if (condition.productPriceLow && !condition.productPriceHigh) {
        where.productPrice = { [Op.gte]: condition.productPriceLow };
      } else if (!condition.productPriceLow && condition.productPriceHigh) {
        where.productPrice = { [Op.lte]: condition.productPriceHigh };
      }
      where.productPrice = { [Op.gte]: condition.productPriceLow, [Op.lte]: condition.productPriceHigh };
    }

    // 検索結果を返却
    return await ProductModel.findAll({
      attributes: [
        ["product_code", "productCode"],
        ["product_name", "productName"],
        "orderKbn",
        ["order_client_code", "orderClientCode"],
        ["product_price", "productPrice"],
        [literal("EXISTS(SELECT 1 FROM orders o WHERE o.product_code = ProductModel.product_code)"), "usedFlg"],
      ],
      where: where,
    });
  }

  /**
   * 商品情報詳細取得
   *
   * @param {*} productCode 商品コード
   * @returns 商品情報
   */
  async findByCode(productCode) {
    return await ProductModel.findByPk(productCode);
  }

  /**
   * 情報登録
   *
   * @param {*} productInfo 商品情報
   */
  async create(productInfo) {
    await ProductModel.create(productInfo);
  }
}

export default new ProductRepository();
