import { literal, Op } from "sequelize";
import productModel from "../models/productModel.js";

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
      where.orderKbn = { [Op.eq]: condition.orderKbn };
    }
    if (condition.productCode) {
      where.productCode = { [Op.eq]: condition.productCode };
    }
    if (condition.productName) {
      where.productName = { [Op.like]: "%" + condition.productName + "%" };
    }
    const hasProductPriceLow = condition.productPriceLow != null && condition.productPriceLow !== "";
    const hasProductPriceHigh = condition.productPriceHigh != null && condition.productPriceHigh !== "";
    if (hasProductPriceLow || hasProductPriceHigh) {
      where.productPrice = {};
      if (hasProductPriceLow) {
        where.productPrice[Op.gte] = condition.productPriceLow;
      }

      if (hasProductPriceHigh) {
        where.productPrice[Op.lte] = condition.productPriceHigh;
      }
    }
    // 検索結果を返却
    return await productModel.findAll({
      attributes: [
        ["product_code", "productCode"],
        ["product_name", "productName"],
        ["order_kbn", "orderKbn"],
        ["order_client_code", "orderClientCode"],
        ["product_price", "productPrice"],
        [literal("EXISTS(SELECT 1 FROM orders o WHERE o.product_code = productModel.product_code)"), "usedFlg"],
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
    return await productModel.findByPk(productCode);
  }

  /**
   * 商品情報物理削除
   *
   * @param {*} productCode 商品コード
   */
  async delete(productCode) {
    await productModel.destroy({
      where: {
        productCode: productCode,
      },
    });
  }
}

export default new ProductRepository();
