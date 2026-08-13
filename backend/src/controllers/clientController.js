import NotFoundError from "../errors/NotFoundError.js";
import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
import clientService from "../services/clientService.js";

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
      console.log(e);
      res.status(500).send();
    }
  }

  /**
   * 取引先情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
    try {
      const pathErrors = [];
      // パスパラメータチェック
      if (!req.params.clientCode) {
        pathErrors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
      } else if (req.params.clientCode.length !== 8) {
        pathErrors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
        pathErrors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
      }

      if (pathErrors.length > 0) {
        res.status(400).json({ errors: pathErrors });
        return;
      }

      const client = await clientService.findByCode(req.params.clientCode);
      res.json(client);
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).json({ errors: [{ field: e.field, message: e.message }] });
      } else {
        res.status(500).send();
      }
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
      const pathErrors = [];
      // パスパラメータチェック
      if (!req.params.clientCode) {
        pathErrors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
      } else if (req.params.clientCode.length !== 8) {
        pathErrors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
        pathErrors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
      }

      if (pathErrors.length > 0) {
        res.status(400).json({ errors: pathErrors });
        return;
      }

      //取引先情報削除
      await clientService.delete(req.params.clientCode);
      res.send();
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).json({ errors: [{ field: e.field, message: e.message }] });
      } else if (e instanceof ReferenceConstraintError) {
        // 外部参照チェックエラー
        res.status(ReferenceConstraintError.status).json({ errors: [{ field: e.field, message: e.message }] });
      } else {
        res.status(500).send();
      }
    }
  }
}
export default new ClientController();
