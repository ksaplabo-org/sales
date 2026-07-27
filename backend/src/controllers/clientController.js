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
   * 取引先情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
    // パスパラメータチェック
    // パスパラメータの取引先コードが設定されていない場合
    const errors = [];
    if (!req.params.clientCode) {
      errors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
    }

    // パスパラメータの取引先コードが8桁で設定されていない場合
    else if (req.params.clientCode.length !== 8) {
      errors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
    }

    // パスパラメータの取引先コードが半角英数で設定されていない場合
    else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
      errors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
    }

    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).json({ errors: errors });
    }

    try {
      const client = await clientService.findByCode(req.params.clientCode);
      res.json(client);
    } catch (err) {
      console.error(err);

      if (err instanceof NotFoundError) {
        // 存在チェックエラー
        errors.push({ field: "clientCode", message: "この取引先情報は存在しません" });
        console.log(errors);
        res.status(NotFoundError.status).json({ errors: errors });
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
     // パスパラメータチェック
    // パスパラメータの取引先コードが設定されていない場合
    const errors = [];
    if (!req.params.clientCode) {
      errors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
    }

    // パスパラメータの取引先コードが8桁で設定されていない場合
    else if (req.params.clientCode.length !== 8) {
      errors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
    }

    // パスパラメータの取引先コードが半角英数で設定されていない場合
    else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
      errors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
    }

    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).json({ errors: errors });
    }


    try {
      await clientService.delete(req.params.clientCode);
      res.send();
    } catch (err) {
      console.log(err);

      if (err instanceof NotFoundError) {
        // 存在チェックエラー
        errors.push({ field: "clientCode", message: "この取引先情報は存在しません" });
        console.log(errors);
        res.status(NotFoundError.status).json({errors:errors});
      } else {
        res.status(500).send();
      }
    }
  }
}
export default new ClientController();
