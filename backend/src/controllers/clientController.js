import UniqueConstraintError from "../errors/UniqueConstraintError.js";
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
   * 取引先情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async create(req, res) {
    try {
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
      };

      // 共通バリデーション
      const errors = this.validate(client);
      //取引先コード
      if (!client.clientCode) {
        errors.push({ field: "clientCode", message: "取引先コードが設定されていません" });
      } else if (client.clientCode.length !== 8) {
        errors.push({ field: "clientCode", message: "取引先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(client.clientCode)) {
        errors.push({ field: "clientCode", message: "取引先コードは半角英数で設定してください" });
      }

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
        // リクエストボディチェックエラー
        res.status(400).json({ errors: errors });
        return;
      }
      // 登録処理実行
      await clientService.create(client);
      res.status(201).send();
    } catch (e) {
      console.log(e);
      if (e instanceof UniqueConstraintError) {
        //一意性制約チェックエラー
        res.status(UniqueConstraintError.status).json({ errors: [{ field: e.field, message: e.message }] });
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

      const client = {
        clientName: req.body.clientName,
        postCode: req.body.postCode,
        address1: req.body.address1,
        address2: req.body.address2,
        telNumber: req.body.telNumber,
        updatedId: req.body.updatedId,
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
        // リクエストボディチェックエラー
        res.status(400).json({ errors: errors });
        return;
      }
      await clientService.update(req.params.clientCode, client);
      res.send();
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

  /**
   * 登録・更新共通バリデーション
   *
   * @param {*} data 登録データ
   * @returns エラー情報配列(空の場合はエラーなし)
   */
  validate(data) {
    const errors = [];
    // 取引先名
    if (!data.clientName) {
      errors.push({ field: "clientName", message: "取引先名が設定されていません" });
    } else if (data.clientName.length > 20) {
      errors.push({ field: "clientName", message: "取引先名は20文字以内で設定してください" });
    }

    // 郵便番号
    if (data.postCode.length !== 7 && data.postCode.length > 0) {
      errors.push({ field: "postCode", message: "郵便番号は7桁で設定してください" });
    } else if (!/^[0-9]+$/.test(data.postCode) && data.postCode.length > 0) {
      errors.push({ field: "postCode", message: "郵便番号は半角数字で設定してください" });
    }

    // 住所1
    if (data.address1.length > 20 && data.address1) {
      errors.push({ field: "address1", message: "住所1は20文字以内で設定してください" });
    }

    // 住所2
    if (data.address2.length > 20 && data.address2) {
      errors.push({ field: "address2", message: "住所2は20文字以内で設定してください" });
    }

    // 電話番号
    if (!/^\d{3}-\d{4}-\d{4}$/.test(data.telNumber) && data.telNumber) {
      errors.push({ field: "telNumber", message: "電話番号はxxx-xxxx-xxxxで設定してください" });
    }
    return errors;
  }
}
export default new ClientController();
