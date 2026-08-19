import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderRepository from "../repositories/orderRepository.js";
import clientRepository from "../repositories/clientRepository.js";
import productRepository from "../repositories/productRepository.js";

class OrderService {
  /**
   * 受発注情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 受発注情報一覧
   */
  async findAll(condition) {
    return await orderRepository.findAll(condition);
  }

  /**
   * 受発注情報登録
   *
   * @param {*} orderInfo 受発注情報
   */
  async create(orderInfo) {
    // 一意性制約チェック
    const order = await orderRepository.findByNo(orderInfo.orderNo);
    if (order) {
      throw new UniqueConstraintError("orderNo", "この受発注番号は既に使用されています");
    }
    const client = await clientRepository.findByCode(orderInfo.clientCode);
    if (!client) {
      throw new NotFoundError("clientCode", "この取引先コードは存在しません");
    }
    const product = await productRepository.findByCode(orderInfo.productCode);
    if (!product) {
      throw new NotFoundError("productCode", "この商品コードは存在しません");
    }

    const now = new Date().toISOString();
    orderInfo.createdAt = now;
    orderInfo.updatedAt = now;

    const amount = orderInfo.quantity * product.productPrice;
    const tax = Math.round(amount * 0.1);
    orderInfo.amount = amount;
    orderInfo.tax = tax;
    orderInfo.amountTaxIncluded = amount + tax;

    await orderRepository.create(orderInfo);
  }

  /**
   * 受発注情報物理削除
   *
   * @param {*} orderNo 受発注番号
   */
  async delete(orderNo) {
    // 削除データの存在チェック
    const order = await orderRepository.findByNo(orderNo);
    if (!order) {
      throw new NotFoundError("orderNo", "この受発注番号は存在しません");
    }
    if (order.confirmedDate) {
      throw new UnprocessableContentError("orderNo", "この受発注番号は確定日が登録されているため削除できません");
    }

    await orderRepository.delete(orderNo);
  }
}

export default new OrderService();
