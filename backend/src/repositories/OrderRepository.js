import { col, fn, literal, Op } from "sequelize";
import OrderModel from "../models/OrderModel.js";

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
      where.orderNo = { [Op.like]: "%" + condition.orderNo + "%" };
    }
    if (condition.orderKbn) {
      where.orderKbn = condition.orderKbn;
    }
    if (condition.clientCode) {
      where.clientCode = { [Op.like]: "%" + condition.clientCode + "%" };
    }
    if (condition.productCode) {
      where.productCode = { [Op.like]: "%" + condition.productCode + "%" };
    }
    if (condition.amountTaxIncludedLow) {
      where.amountTaxIncluded = { ...where.amountTaxIncluded,
        [Op.gte]: condition.amountTaxIncludedLow, };
    }
    if (condition.amountTaxIncludedHigh) {
      where.amountTaxIncluded = { ...where.amountTaxIncluded,
        [Op.lte]: condition.amountTaxIncludedHigh, };
    }
    if (!condition.includeDeleted) {
      where.delFlg = false;
    }

    // 検索結果を返却
    return await OrderModel.findAll({
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
   * @param {*} no 受発注番号
   * @returns 受発注情報
   */
  async findById(no) {
    return await OrderModel.findByPk(no);
  }

  /**
   * 受発注情報登録
   *
   * @param {*} orderInfo 受発注情報
   */
  async create(orderInfo) {
    await OrderModel.create(orderInfo);
  }

  /**
   * 受発注情報更新
   *
   * @param {*} orderNo 受発注番号
   * @param {*} orderInfo 受発注情報
   */
  async update(orderNo, orderInfo) {
    await OrderModel.update(orderInfo, {
      where: {
        orderNo: orderNo,
      },
    });
  }

  /**
   * 受発注情報論理削除
   *
   * @param {*} orderNo 受発注番号
   */
  async delete(orderNo) {
    await OrderModel.update(
      { delFlg: true },
      {
        where: {
          orderNo: orderNo,
        },
      },
    );
  }
}

export default new OrderRepository();