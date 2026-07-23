import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import orderRepository from "../repositories/OrderRepository.js";

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
   * 受発注情報詳細取得
   *
   * @param {*} no 受発注番号
   * @returns 受発注情報詳細
   */
  async findById(no) {
    const order = await orderRepository.findById(no);
    if (!order || order.delFlg) {
      throw new NotFoundError();
    }
    return order;
  }

  /**
   * 受発注情報登録
   *
   * @param {*} orderInfo 受発注情報
   */
  async create(orderInfo) {
    // 一意性制約チェック
    const order = await orderRepository.findById(orderInfo.orderNo);
    if (order) {
      throw new UniqueConstraintError();
    }

    await orderRepository.create(orderInfo);
  }

  /**
   * 受発注情報更新
   *
   * @param {*} orderNo 受発注番号
   * @param {*} orderInfo 受発注情報
   */
  async update(orderNo, orderInfo) {
    // 更新データの存在チェック
    const order = await orderRepository.findById(orderNo);
    if (!order) {
      throw new NotFoundError();
    }
    await orderRepository.update(orderNo, orderInfo);
  }

  /**
   * 受発注情報論理削除
   *
   * @param {*} orderNo 受発注番号
   */
  async delete(orderNo) {
    // 削除データの存在チェック
    const order = await orderRepository.findById(orderNo);
    if (!order) {
      throw new NotFoundError();
    }

    await orderRepository.delete(orderNo);
  }
}

export default new OrderService();
