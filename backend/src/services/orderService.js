import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderRepository from "../repositories/orderRepository.js";
import userRepository from "../repositories/userRepository.js";
import productRepository from "../repositories/productRepository.js";
import ValidationError from "../errors/ValidationError.js";

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
   * @param {*} orderNo 受発注番号
   * @returns 受発注情報詳細
   */
  async findByNo(orderNo) {
    const order = await orderRepository.findByNo(orderNo);
    if (!order) {
      //受発注番号の存在チェック
      throw new NotFoundError("orderNo", "この受発注番号は存在しません");
    }

    const user = await userRepository.findById(order.updatedId);
    if (!user) {
      //ユーザーIDの存在チェック
      throw new NotFoundError("userId", "このユーザーIDは存在しません");
    }

    //更新者名の設定
    order.dataValues.updatedName = `${user.lastName} ${user.firstName}`;

    return order;
  }

  /**
   * 受発注情報更新
   *
   * @param {*} orderNo 受発注番号
   * @param {*} orderInfo 受発注情報
   */
  async update(orderNo, orderInfo) {
    // 更新データの存在チェック
    const order = await orderRepository.findByNo(orderNo);
    if (!order) {
      throw new NotFoundError("orderNo", "この受発注番号は存在しません");
    }

    //バリデーションチェック
    const errors = [];

    //確定日
    if (order.confirmedDate) {
      if (orderInfo.confirmedDate) {
        errors.field = "confirmedDate";
        errors.message = "確定日は入力できません";
      }
    } else if (!order.confirmedDate && orderInfo.confirmedDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(orderInfo.confirmedDate)) {
        errors.field = "confirmedDate";
        errors.message = "日付はyyyy-MM-ddの形式で入力してください";
      } else if (isNaN(new Date(orderInfo.confirmedDate).getTime())) {
        errors.field = "confirmedDate";
        errors.message = "正しい日付を入力してください";
      } else if (new Date(orderInfo.confirmedDate) < new Date(order.orderDate)) {
        errors.field = "confirmedDate";
        errors.message = "確定日は受発注日以降の日付を入力してください";
      }
    }

    // 出荷日
    if (order.orderKbn === "2") {
      //受発注区分が発注の場合
      if (orderInfo.shipDate) {
        errors.field = "shipDate";
        errors.message = "出荷日は入力できません";
      }
    } else if (order.orderKbn === "1" && orderInfo.shipDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(orderInfo.shipDate)) {
        errors.field = "shipDate";
        errors.message = "日付はyyyy-MM-ddの形式で入力してください";
      } else if (isNaN(new Date(orderInfo.shipDate).getTime())) {
        errors.field = "shipDate";
        errors.message = "正しい日付を入力してください";
      } else if (new Date(orderInfo.shipDate) < new Date(order.orderDate)) {
        errors.field = "shipDate";
        errors.message = "出荷日は受注日以降の日付を入力してください";
      } else if (orderInfo.confirmedDate && new Date(orderInfo.shipDate) < new Date(orderInfo.confirmedDate)) {
        errors.field = "shipDate";
        errors.message = "出荷日は入金日以降の日付を入力してください";
      }
    }

    //エラー情報配列要素が存在する場合
    if (errors.length > 0) {
      throw new ValidationError(errors.field, errors.message);
    }

    const product = await productRepository.findByCode(orderInfo.productCode);
    if (!product) {
      //商品コードの存在チェック
      throw new NotFoundError("productCode", "この商品コードは存在しません");
    }

    //現在日時を取得
    const now = new Date().toISOString();
    orderInfo.updatedAt = now;

    //金額、消費税、合計金額の設定
    orderInfo.amount = orderInfo.quantity * product.productPrice;
    orderInfo.tax = Math.round(orderInfo.amount * 0.1);
    orderInfo.amountTaxIncluded = orderInfo.amount + orderInfo.tax;

    await orderRepository.update(orderNo, orderInfo);
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
    //削除データの削除可否チェック
    if (order.confirmedDate) {
      throw new UnprocessableContentError("orderNo", "この受発注番号は確定日が登録されているため削除できません");
    }

    await orderRepository.delete(orderNo);
  }
}

export default new OrderService();
