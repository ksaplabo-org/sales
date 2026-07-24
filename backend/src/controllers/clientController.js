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

  /**
   * 取引先情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      // パスパラメータチェック
      // パスパラメータの取引先コードが設定されていない場合
      if (!req.params.clientCode) {
        console.error(err);
        res.status(400).send();
      }

      // パスパラメータの取引先コードが8桁で設定されていない場合
      else if (req.params.clientCode.length !== 8) {
        console.error(e);
        res.status(400).send();
      }

      // パスパラメータの取引先コードが半角英数で設定されていない場合
      else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
        console.error(err);
        res.status(400).send();
      }
      await clientService.delete(req.params.clientCode);
      res.send();
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }
}
export default new ClientController();
