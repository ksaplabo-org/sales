import NotFoundError from "../errors/NotFoundError.js";
import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
import ClientService from "../services/clientService.js";

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
      const clients = await ClientService.findAll(condition);
      return res.json(clients);
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  }

  /**
   * 取引先情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
    const errors = [];
    try {
      // パスパラメータチェック
      if (!req.params.clientCode) {
        errors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
      } else if (req.params.clientCode.length !== 8) {
        errors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
        errors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        console.log(errors);
        return res.status(400).json({ errors: errors });
      }

      const client = await ClientService.findByCode(req.params.clientCode);
      return res.json(client);
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        errors.push({ field: "clientCode", message: "この取引先情報は存在しません" });
        console.log(errors);
        return res.status(NotFoundError.status).json({ errors: errors });
      } else {
        return res.status(500).send();
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
    const errors = [];
    try {
      // パスパラメータチェック
      if (!req.params.clientCode) {
        errors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
      } else if (req.params.clientCode.length !== 8) {
        errors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.clientCode)) {
        errors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        console.log(errors);
        return res.status(400).json({ errors: errors });
      }

      //取引先情報削除
      await ClientService.delete(req.params.clientCode);
      return res.send();
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        errors.push({ field: "clientCode", message: "この取引先情報は存在しません" });
        console.log(errors);
        return res.status(NotFoundError.status).json({ errors: errors });
      } else if (e instanceof ReferenceConstraintError) {
        // 外部参照チェックエラー
        errors.push({ field: "clientCode", message: "取引先コードが受発注情報で使用されているため削除できません" });
        console.log(errors);
        return res.status(ReferenceConstraintError.status).json({ errors: errors });
      } else {
        return res.status(500).send();
      }
    }
  }
}
export default new ClientController();
