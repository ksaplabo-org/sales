import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import clientService from "../services/ClientService.js";

class ClientController {
  /**
   * 取引先情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
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

      const client = await clientService.findByCode(req.params.clientCode);
      res.json(client);
    } catch (err) {
      console.error(err);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 取引先情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async create(req, res) {
    try {
      const now = new Date().toISOString();

      const client = {
        clientCode: req.body.clientCode,
        clientName: req.body.clientName,
        orderKbn: req.body.orderKbn,
        postCode: req.body.postCode,
        address1: req.body.address1,
        address2: req.body.address2,
        telNumber: req.body.telNumber,
        createdId: req.body.createdId,
        updatedId: req.body.createdId,
        createdAt: now,
        usedFlg: false,
      };

      // 共通バリデーション
      const errors = this.validate(client);

      // 受発注区分
      if (!client.orderKbn) {
        errors.push({ field: "orderKbn", message: "受発注区分が設定されていません" });
      } else if (!["1", "2"].includes(client.orderKbn)) {
        errors.push({ field: "orderKbn", message: "受発注区分は'1'か'2'を設定してください" });
      }

      // 登録者ID
      if (!client.createdId) {
        errors.push({ field: "createdId", message: "登録者IDが設定されていません" });
      } else if (client.createdId.length !== 6) {
        errors.push({ field: "createdId", message: "登録者IDは6桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(client.createdId)) {
        errors.push({ field: "createdId", message: "登録者IDは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        // 登録処理実行
        await clientService.create(client);
        res.status(201).send();
      }
    } catch (e) {
      console.log(e);

      if (e instanceof UniqueConstraintError) {
        res.status(UniqueConstraintError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }
  /**
   * 取引先情報更新
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async update(req, res) {
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

      const now = new Date().toISOString();

      const clientCode = req.params.clientCode;
      const orderKbn = req.params.orderKbn;
      const client = {
        clientCode: clientCode,
        clientName: req.body.clientName,
        orderKbn: orderKbn,
        postCode: req.body.postCode,
        address1: req.body.address1,
        address2: req.body.address2,
        telNumber: req.body.telNumber,
        updatedId: req.body.updatedId,
        updatedAt: now,
      };

      // 共通バリデーション
      const errors = this.validate(client);

      // 更新者ID
      if (!client.updatedId) {
        errors.push({ field: "updatedId", message: "更新者IDが設定されていません" });
      } else if (client.updatedId.length !== 6) {
        errors.push({ field: "updatedId", message: "更新者IDは6桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(client.updatedId)) {
        errors.push({ field: "updatedId", message: "更新者IDは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        await clientService.update(req.params.clientCode, req.body);
        res.send();
      }
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
