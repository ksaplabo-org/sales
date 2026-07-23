import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
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
}