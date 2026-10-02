import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
import noticeService from "../services/noticeService.js";

class NoticeController {
  /**
   * お知らせ情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findAll(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        noticeId: req.query.noticeId,
        startSearchDate: req.query.startSearchDate,
        endSearchDate: req.query.endSearchDate,
        targetType: req.query.targetType,
      };

      // お知らせ情報一覧検索
      const notices = await noticeService.findAll(condition);
      res.json(notices);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }

  /**
   * お知らせ情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findById(req, res) {
    try {
      const errors = [];

      if (!req.params.noticeId) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDが設定されていません",
        });
      } else if (req.params.noticeId.length != 7) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.noticeId)) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      }

      // お知らせ情報詳細取得
      const notice = await noticeService.findById(req.params.noticeId);
      res.json(notice);
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * お知らせ情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async create(req, res) {
    try {
      const notice = {
        noticeId: req.body.noticeId,
        title: req.body.title,
        content: req.body.content,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        targetType: req.body.targetType,
        createdId: req.body.createdId,
        updatedId: req.body.createdId,
      };

      // 共通バリデーション
      const errors = this.validate(notice);

      // お知らせID
      if (!notice.noticeId) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDが設定されていません",
        });
      } else if (notice.noticeId.length != 7) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(notice.noticeId)) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは半角英数で設定してください",
        });
      }

      // 登録者ID
      if (!notice.createdId) {
        errors.push({
          field: "createdId",
          message: "登録者IDが設定されていません",
        });
      } else if (notice.createdId.length != 6) {
        errors.push({
          field: "createdId",
          message: "登録者IDは6桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(notice.createdId)) {
        errors.push({
          field: "createdId",
          message: "登録者IDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      } else {
        // 登録処理
        await noticeService.create(notice);
        res.status(201).send();
        return;
      }
    } catch (e) {
      console.log(e);
      if (e instanceof UniqueConstraintError) {
        //一意制約エラー
        res.status(UniqueConstraintError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else if (e instanceof ValidationError) {
        //パラメータエラー
        res.status(ValidationError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * お知らせ情報更新
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async update(req, res) {
    try {
      let errors = [];

      if (!req.params.noticeId) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDが設定されていません",
        });
      } else if (req.params.noticeId.length != 7) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.noticeId)) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      }

      const notice = {
        title: req.body.title,
        content: req.body.content,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        targetType: req.body.targetType,
        updatedId: req.body.updatedId,
      };

      // 共通バリデーション
      errors = this.validate(notice);

      // 更新者ID
      if (!notice.updatedId) {
        errors.push({
          field: "updatedId",
          message: "更新者IDが設定されていません",
        });
      } else if (notice.updatedId.length != 6) {
        errors.push({
          field: "updatedId",
          message: "更新者IDは6桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(notice.updatedId)) {
        errors.push({
          field: "updatedId",
          message: "更新者IDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      } else {
        //更新処理
        await noticeService.update(req.params.noticeId, notice);
        res.send();
      }
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        //存在チェックエラー
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else if (e instanceof ValidationError) {
        //パラメータエラー
        res.status(ValidationError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * お知らせ情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      const errors = [];

      if (!req.params.noticeId) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDが設定されていません",
        });
      } else if (req.params.noticeId.length != 7) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.noticeId)) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      }

      // お知らせ情報削除
      await noticeService.delete(req.params.noticeId);
      res.send();
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        //存在チェックエラー
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
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

    // タイトル
    if (!data.title) {
      errors.push({
        field: "title",
        message: "タイトルが設定されていません",
      });
    } else if (data.title.length > 20) {
      errors.push({
        field: "title",
        message: "タイトルは20桁以内で設定してください",
      });
    }

    // 内容
    if (!data.content) {
      errors.push({
        field: "content",
        message: "内容が設定されていません",
      });
    }

    // 掲載開始日
    const startDate = new Date(data.startDate);
    if (!data.startDate) {
      errors.push({
        field: "startDate",
        message: "掲載開始日が設定されていません",
      });
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)) {
      errors.push({
        field: "startDate",
        message: "掲載開始日はyyyy-MM-ddの形式で設定してください",
      });
    } else if (isNaN(startDate.getTime()) || startDate.toISOString().slice(0, 10) !== data.startDate) {
      errors.push({
        field: "startDate",
        message: "掲載開始日に正しい日付を入力してください",
      });
    }

    // 掲載終了日
    const endDate = new Date(data.endDate);
    if (!data.endDate) {
      errors.push({
        field: "endDate",
        message: "掲載終了日が設定されていません",
      });
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.endDate)) {
      errors.push({
        field: "endDate",
        message: "掲載終了日はyyyy-MM-ddの形式で設定してください",
      });
    } else if (isNaN(endDate.getTime()) || endDate.toISOString().slice(0, 10) !== data.endDate) {
      errors.push({
        field: "endDate",
        message: "掲載終了日に正しい日付を入力してください",
      });
    } else if (data.endDate < data.startDate) {
      errors.push({
        field: "endDate",
        message: "掲載終了日を掲載開始日以降に設定してください",
      });
    }

    //表示対象
    if (!data.targetType) {
      errors.push({
        field: "targetType",
        message: "表示対象が設定されていません",
      });
    } else if (data.targetType != "0" && data.targetType != "1" && data.targetType != "2") {
      errors.push({
        field: "targetType",
        message: "表示対象に" + "0" + "," + "1" + "," + "2" + "のいずれかを設定してください",
      });
    }

    return errors;
  }
}

export default new NoticeController();
