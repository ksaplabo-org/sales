import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import clientService from "../services/ClientService.js";

class ClientController {
  /**
   * 取引先情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */

  async findAll(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        clientCode: req.query.clientCode,
        clientName: req.query.clientName,
        orderKbn: req.query.orderKbn,
      };

      // 取引先情報一覧検索
      const clients = await clientService.findAll(condition);
      res.json(clients);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }
}
export default new ClientController();
