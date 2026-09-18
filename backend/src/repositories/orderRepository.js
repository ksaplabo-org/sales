import { col, fn, literal, Op } from "sequelize";
import orderModel from "../models/orderModel.js";

class OrderRepository {
  /**
   * 受発注情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 受発注情報一覧
   */
  async findAll(condition) {
    // 検索条件を作成
    const where = {};
    if (condition.orderNo) {
      where.orderNo = { [Op.like]: condition.orderNo + "%" };
    }
    if (condition.orderKbn) {
      where.orderKbn = condition.orderKbn;
    }
    if (condition.clientCode) {
      where.clientCode = condition.clientCode;
    }
    if (condition.productCode) {
      where.productCode = condition.productCode;
    }
    if (condition.amountTaxIncludedLow) {
      where.amountTaxIncluded = { [Op.gte]: condition.amountTaxIncludedLow };
    }
    if (condition.amountTaxIncludedHigh) {
      where.amountTaxIncluded = { ...where.amountTaxIncluded, [Op.lte]: condition.amountTaxIncludedHigh };
    }

    // 検索結果を返却
    return await orderModel.findAll({
      attributes: [
        ["order_no", "orderNo"],
        ["order_kbn", "orderKbn"],
        ["client_code", "clientCode"],
        ["product_code", "productCode"],
        ["order_date", "orderDate"],
        ["confirmed_date", "confirmedDate"],
        ["amount_tax_included", "amountTaxIncluded"],
      ],
      where: where,
    });
  }

  /**
   * 受発注情報詳細取得
   *
   * @param {*} orderNo 受発注番号
   * @returns 受発注情報
   */
  async findByNo(orderNo) {
    return await orderModel.findByPk(orderNo);
  }

  /**
   * 受発注情報更新
   *
   * @param {*} orderNo 受発注番号
   * @param {*} orderInfo 受発注情報
   */
  async update(orderNo, orderInfo) {
    await orderModel.update(orderInfo, {
      where: {
        orderNo: orderNo,
      },
    });
  }

  /**
   * 受発注情報物理削除
   *
   * @param {*} orderNo 受発注番号
   */
  async delete(orderNo) {
    await orderModel.destroy({
      where: {
        orderNo: orderNo,
      },
    });
  }
}

export default new OrderRepository();
