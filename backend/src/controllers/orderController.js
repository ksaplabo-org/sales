import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderService from "../services/orderService.js";
import OrderValidationError from "../errors/OrderValidationError.js";

class OrderController {
  /**
   * 受発注情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findAll(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        orderNo: req.query.orderNo,
        orderKbn: req.query.orderKbn,
        clientCode: req.query.clientCode,
        productCode: req.query.productCode,
        amountTaxIncludedLow: req.query.amountTaxIncludedLow,
        amountTaxIncludedHigh: req.query.amountTaxIncludedHigh,
      };

      // 受発注情報一覧検索
      const orders = await orderService.findAll(condition);
      res.json(orders);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }

  /**
   * 受発注情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByNo(req, res) {
    try {
      const errors = [];

      //受発注番号バリデーション
      if (!req.params.orderNo) {
        errors.push({ field: "orderNo", message: "受発注番号を入力してください" });
      } else if (req.params.orderNo.length != 8) {
        errors.push({ field: "orderNo", message: "受発注番号は8桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.orderNo)) {
        errors.push({ field: "orderNo", message: "受発注番号は半角英数で入力してください" });
      }

      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
        return;
      }

      const order = await orderService.findByNo(req.params.orderNo);
      res.json(order);
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 受発注情報編集
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async update(req, res) {
    try {
      let errors = [];

      //受発注番号バリデーション
      if (!req.params.orderNo) {
        errors.push({ field: "orderNo", message: "受発注番号を入力してください" });
      } else if (req.params.orderNo.length != 8) {
        errors.push({ field: "orderNo", message: "受発注番号は8桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.orderNo)) {
        errors.push({ field: "orderNo", message: "受発注番号は半角英数で入力してください" });
      }

      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
        return;
      }

      const order = {
        confirmedDate: req.body.confirmedDate,
        shipDate: req.body.shipDate,
        deliverDate: req.body.deliverDate,
        productCode: req.body.productCode,
        quantity: req.body.quantity,
        updatedId: req.body.updatedId,
      };

      if (order.confirmedDate == "") {
        order.confirmedDate = null;
      }
      if (order.shipDate == "") {
        order.shipDate = null;
      }
      if (order.deliverDate == "") {
        order.deliverDate = null;
      }

      // 共通バリデーション
      errors = this.validate(order);

      // 更新者IDバリデーション
      if (!order.updatedId) {
        errors.push({ field: "updatedId", message: "更新者IDを入力してください" });
      } else if (order.updatedId.length != 6) {
        errors.push({ field: "updatedId", message: "更新者IDは6桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(order.updatedId)) {
        errors.push({ field: "updatedId", message: "更新者IDは半角英数で入力してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        await orderService.update(req.params.orderNo, order);
        res.send();
      }
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else if (e instanceof OrderValidationError) {
        //パラメータエラー
        res.status(OrderValidationError.status).json({
          errors: e.errors,
        });
        return;
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 受発注情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      const errors = [];
      // 受発注番号バリデーション
      if (!req.params.orderNo) {
        errors.push({ field: "orderNo", message: "受発注番号を入力してください" });
      } else if (req.params.orderNo.length != 8) {
        errors.push({ field: "orderNo", message: "受発注番号は8桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.orderNo)) {
        errors.push({ field: "orderNo", message: "受発注番号は半角英数で入力してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        await orderService.delete(req.params.orderNo);
        res.send();
      }
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).json({ errors: [{ field: e.field, message: e.message }] });
      } else if (e instanceof UnprocessableContentError) {
        res.status(UnprocessableContentError.status).json({ errors: [{ field: e.field, message: e.message }] });
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 登録・更新共通バリデーション
   *
   * @param {*} data 登録データ
   * @returns エラー情報配列(空の場合はエラーなし)
   */
  validate(data) {
    const errors = [];

    // 商品コードバリデーション
    if (!data.productCode) {
      errors.push({ field: "productCode", message: "商品コードを入力してください" });
    } else if (data.productCode.length != 7) {
      errors.push({ field: "productCode", message: "商品コードは7桁で入力してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.productCode)) {
      errors.push({ field: "productCode", message: "商品コードは半角英数で入力してください" });
    }

    // 数量バリデーション
    if (!data.quantity) {
      errors.push({ field: "quantity", message: "数量を入力してください" });
    } else if (!/^\d+$/.test(data.quantity)) {
      errors.push({ field: "quantity", message: "数量は半角数字で入力してください" });
    } else if (Number(data.quantity) < 1) {
      errors.push({ field: "quantity", message: "数量は1以上で入力してください" });
    }

    return errors;
  }
}

export default new OrderController();
