import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnprocessableContentError from "../errors/UnprocessableContentError.js";
import orderService from "../services/OrderService.js";

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
      console.error(e);
      res.status(500).send();
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
        errors.push({ field: "orderNo", message: "受発注番号は8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.orderNo)) {
        errors.push({ field: "orderNo", message: "受発注番号は半角英数で設定してください" });
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
}

export default new OrderController();
