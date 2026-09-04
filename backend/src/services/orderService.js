import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderRepository from "../repositories/orderRepository.js";
import userRepository from "../repositories/userRepository.js";
import productRepository from "../repositories/productRepository.js";
import OrderValidationError from "../errors/OrderValidationError.js";

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
    //受発注番号の存在チェック
    const order = await orderRepository.findByNo(orderNo);
    if (!order) {
      throw new NotFoundError("orderNo", "この受発注番号は存在しません");
    }

    const user = await userRepository.findById(order.updatedId);

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
    const confirmedDateValue = orderInfo.confirmedDate || order.confirmedDate;

    //確定日
    if (order.confirmedDate) {
      if (orderInfo.confirmedDate) {
        errors.push({ field: "confirmedDate", message: "確定日は入力できません" });
      }
    } else if (!order.confirmedDate && orderInfo.confirmedDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(orderInfo.confirmedDate)) {
        errors.push({ field: "confirmedDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
      } else {
        const confirmedDate = new Date(orderInfo.confirmedDate);
        const orderDate = new Date(order.orderDate);
        if (isNaN(confirmedDate.getTime()) || confirmedDate.toISOString().slice(0, 10) !== orderInfo.confirmedDate) {
          errors.push({ field: "confirmedDate", message: "正しい日付を入力してください" });
        } else if (confirmedDate < orderDate) {
          errors.push({ field: "confirmedDate", message: "確定日は受発注日以降の日付を入力してください" });
        }
      }
    }

    // 出荷日
    //受発注区分が発注の場合は出荷日の指定はエラー
    if (order.orderKbn === "2") {
      if (orderInfo.shipDate) {
        errors.push({ field: "shipDate", message: "出荷日は入力できません" });
      }
    } else if (order.orderKbn === "1" && orderInfo.shipDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(orderInfo.shipDate)) {
        errors.push({ field: "shipDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
      } else {
        const orderDate = new Date(order.orderDate);
        const confirmedDate = confirmedDateValue ? new Date(confirmedDateValue) : null;
        const shipDate = new Date(orderInfo.shipDate);
        if (isNaN(shipDate.getTime()) || shipDate.toISOString().slice(0, 10) !== orderInfo.shipDate) {
          errors.push({ field: "shipDate", message: "正しい日付を入力してください" });
        } else if (shipDate < orderDate) {
          errors.push({ field: "shipDate", message: "出荷日は受注日以降の日付を入力してください" });
        } else if (confirmedDate && shipDate < confirmedDate) {
          errors.push({ field: "shipDate", message: "出荷日は入金日以降の日付を入力してください" });
        }
      }
    }

    //納品予定日バリデーション
    if (orderInfo.deliverDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(orderInfo.deliverDate)) {
        errors.push({ field: "deliverDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
      } else {
        const orderDate = new Date(order.orderDate);
        const confirmedDate = confirmedDateValue ? new Date(confirmedDateValue) : null;
        const shipDate = orderInfo.shipDate ? new Date(orderInfo.shipDate) : null;
        const deliverDate = new Date(orderInfo.deliverDate);
        if (isNaN(deliverDate.getTime()) || deliverDate.toISOString().slice(0, 10) !== orderInfo.deliverDate) {
          errors.push({ field: "deliverDate", message: "正しい日付を入力してください" });
        } else if (deliverDate < orderDate) {
          errors.push({ field: "deliverDate", message: "納品予定日は受発注日以降の日付を入力してください" });
        } else if (confirmedDate && deliverDate < confirmedDate) {
          errors.push({ field: "deliverDate", message: "納品予定日は確定日以降の日付を入力してください" });
        } else if (shipDate && deliverDate < shipDate) {
          errors.push({ field: "deliverDate", message: "納品予定日は出荷日以降の日付を入力してください" });
        }
      }
    }

      //エラー情報配列要素が存在する場合
      if (errors.length > 0) {
        throw new OrderValidationError(errors);
      }
      //商品コードの存在チェック
      const product = await productRepository.findByCode(orderInfo.productCode);
      if (!product) {
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
