import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderService from "../services/orderService.js";

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
   * 受発注情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async create(req, res) {
    try {
      const order = {
        orderNo: req.body.orderNo,
        orderKbn: req.body.orderKbn,
        clientCode: req.body.clientCode,
        orderDate: req.body.orderDate,
        confirmedDate: req.body.confirmedDate,
        shipDate: req.body.shipDate,
        deliverDate: req.body.deliverDate,
        productCode: req.body.productCode,
        quantity: req.body.quantity,
        createdId: req.body.createdId,
        updatedId: req.body.createdId,
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
      const errors = this.validate(order);

      // 受発注番号エラー
      if (!order.orderNo) {
        errors.push({ field: "orderNo", message: "受発注番号を入力してください" });
      } else if (order.orderNo.length != 8) {
        errors.push({ field: "orderNo", message: "受発注番号は8桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(order.orderNo)) {
        errors.push({ field: "orderNo", message: "受発注番号は半角英数で入力してください" });
      }

      // 受発注区分エラー
      if (!order.orderKbn) {
        errors.push({ field: "orderKbn", message: "受発注区分を入力してください" });
      } else if (!["1", "2"].includes(order.orderKbn)) {
        errors.push({ field: "orderKbn", message: "受発注区分は1か2を入力してください" });
      }

      // 取引先コードエラー
      if (!order.clientCode) {
        errors.push({ field: "clientCode", message: "取引先コードを入力してください" });
      } else if (order.clientCode.length != 8) {
        errors.push({ field: "clientCode", message: "取引先コードは8桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(order.clientCode)) {
        errors.push({ field: "clientCode", message: "取引先コードは半角英数で入力してください" });
      }

      //受発注日エラー
      if (!order.orderDate) {
        errors.push({ field: "orderDate", message: "受発注日を入力してください" });
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(order.orderDate)) {
        errors.push({ field: "orderDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
      } else if (
        isNaN(new Date(order.orderDate).getTime()) ||
        new Date(order.orderDate).toISOString().slice(0, 10) !== order.orderDate
      ) {
        errors.push({ field: "orderDate", message: "正しい日付を入力してください" });
      }

      //確定日エラー
      if (order.confirmedDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(order.confirmedDate)) {
          errors.push({ field: "confirmedDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
        } else if (
          isNaN(new Date(order.confirmedDate).getTime()) ||
          new Date(order.confirmedDate).toISOString().slice(0, 10) !== order.confirmedDate
        ) {
          errors.push({ field: "confirmedDate", message: "正しい日付を入力してください" });
        } else if (new Date(order.confirmedDate) < new Date(order.orderDate)) {
          errors.push({ field: "confirmedDate", message: "確定日は受発注日以降の日付を入力してください" });
        }
      }

      //出荷日エラー
      if (order.orderKbn === "2" && order.shipDate) {
        //発注
        errors.push({ field: "shipDate", message: "出荷日は入力できません" });
      } else if (order.orderKbn === "1" && order.shipDate) {
        //受注
        if (!/^\d{4}-\d{2}-\d{2}$/.test(order.shipDate)) {
          errors.push({ field: "shipDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
        } else if (
          isNaN(new Date(order.shipDate).getTime()) ||
          new Date(order.shipDate).toISOString().slice(0, 10) !== order.shipDate
        ) {
          errors.push({ field: "shipDate", message: "正しい日付を入力してください" });
        } else if (new Date(order.shipDate) < new Date(order.orderDate)) {
          errors.push({ field: "shipDate", message: "出荷日は受注日以降の日付を入力してください" });
        } else if (order.confirmedDate && new Date(order.shipDate) < new Date(order.confirmedDate)) {
          errors.push({ field: "shipDate", message: "出荷日は入金日以降の日付を入力してください" });
        }
      }

      //納品予定日エラー
      if (order.deliverDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(order.deliverDate)) {
          errors.push({ field: "deliverDate", message: "日付はyyyy-MM-ddの形式で入力してください" });
        } else if (
          isNaN(new Date(order.deliverDate).getTime()) ||
          new Date(order.deliverDate).toISOString().slice(0, 10) !== order.deliverDate
        ) {
          errors.push({ field: "deliverDate", message: "正しい日付を入力してください" });
        } else if (new Date(order.deliverDate) < new Date(order.orderDate)) {
          errors.push({ field: "deliverDate", message: "納品予定日は受発注日以降の日付を入力してください" });
        } else if (new Date(order.deliverDate) < new Date(order.confirmedDate)) {
          errors.push({ field: "deliverDate", message: "納品予定日は確定日以降の日付を入力してください" });
        } else if (new Date(order.deliverDate) < new Date(order.shipDate)) {
          errors.push({ field: "deliverDate", message: "納品予定日は出荷日以降の日付を入力してください" });
        }
      }

      //登録者IDエラー
      if (!order.createdId) {
        errors.push({ field: "createdId", message: "登録者IDを入力してください" });
      } else if (order.createdId.length != 6) {
        errors.push({ field: "createdId", message: "登録者IDは6桁で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(order.createdId)) {
        errors.push({ field: "createdId", message: "登録者IDは半角英数で入力してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        // 登録処理実行
        await orderService.create(order);
        res.status(201).send();
      }
    } catch (e) {
      console.log(e);

      if (e instanceof UniqueConstraintError) {
        res.status(UniqueConstraintError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
      } else if (e instanceof NotFoundError) {
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
   * 受発注情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      const errors = [];
      // 受発注番号のバリデーション
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

    // 商品コードエラー
    if (!data.productCode) {
      errors.push({ field: "productCode", message: "商品コードを入力してください" });
    } else if (data.productCode.length != 7) {
      errors.push({ field: "productCode", message: "商品コードは7桁で入力してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.productCode)) {
      errors.push({ field: "productCode", message: "商品コードは半角英数で入力してください" });
    }

    // 数量エラー
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
