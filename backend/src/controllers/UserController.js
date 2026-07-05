import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UserService from "../services/UserService.js";

class UserController {
  service = new UserService();

  /**
   * ユーザー情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async find(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        userId: req.query.userId,
        userName: req.query.userName,
        role: req.query.role,
        includeDeleted: req.query.includeDeleted === "true",
      };

      // ユーザー情報一覧検索
      const users = await this.service.find(condition);
      res.json(users);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  /**
   * ユーザー情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findById(req, res) {
    try {
      const user = await this.service.findById(req.params.userId);

      // 検索結果なし または 論理削除されている場合は404応答
      if (!user || user.delFlg) {
        res.status(404).send();
      } else {
        res.json(user);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }

  /**
   * ユーザー情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async insert(req, res) {
    try {
      const now = new Date().toISOString();

      const user = {
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        birthday: req.body.birthday,
        role: req.body.role,
        createdId: req.body.createdId,
        createdAt: now,
        updatedId: req.body.createdId,
        updatedAt: now,
      };

      // 共通バリデーション
      const errors = this.validate(user);

      // 登録者ID
      if (!user.createdId) {
        errors.push({ field: "createdId", message: "登録者IDが未入力です" });
      } else if (user.createdId.length > 6) {
        errors.push({ field: "createdId", message: "登録者IDは6桁以内で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(user.createdId)) {
        errors.push({ field: "createdId", message: "登録者IDは半角英数で入力してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        // 登録処理実行]
        await this.service.insert(req.body);
        res.status(201).send();
      }
    } catch (e) {
      console.log(e);

      // 一意制約エラー
      if (e instanceof UniqueConstraintError) {
        res.status(UniqueConstraintError.status).send();
      }

      // システムエラー
      res.status(500).send();
    }
  }

  /**
   * ユーザー情報更新
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async update(req, res) {
    try {
      const now = new Date().toISOString();

      const userId = req.params.userId;
      const user = {
        userId: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        birthday: req.body.birthday,
        role: req.body.role,
        updatedId: req.body.updatedId,
        updatedAt: now,
      };

      // 共通バリデーション
      const errors = this.validate(user);

      // 更新者ID
      if (!user.updatedId) {
        errors.push({ field: "updatedId", message: "更新者IDが未入力です" });
      } else if (user.updatedId.length > 6) {
        errors.push({ field: "updatedId", message: "更新者IDは6桁以内で入力してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(user.updatedId)) {
        errors.push({ field: "updatedId", message: "更新者IDは半角英数で入力してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        await this.service.update(req.params.userId, req.body);
        res.status(200).send();
      }
    } catch (e) {
      console.log(e);

      // 存在チェックエラー
      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).send();
      }

      res.status(500).send();
    }
  }

  /**
   * ユーザー情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      // 必須チェック
      const userId = req.params.userId;
      await this.service.delete(userId);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
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

    // ユーザーID
    if (!data.userId) {
      errors.push({ field: "userId", message: "ユーザーIDが未入力です" });
    } else if (data.userId.length > 6) {
      errors.push({ field: "userId", message: "ユーザーIDは6桁以内で入力してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.userId)) {
      errors.push({ field: "userId", message: "ユーザーIDは半角英数で入力してください" });
    }

    // 姓
    if (!data.lastName) {
      errors.push({ field: "lastName", message: "姓が未入力です" });
    } else if (data.lastName.length > 6) {
      errors.push({ field: "lastName", message: "姓は10桁以内で入力してください" });
    }

    // 名
    if (!data.firstName) {
      errors.push({ field: "firstName", message: "名が未入力です" });
    } else if (data.firstName.length > 6) {
      errors.push({ field: "firstName", message: "名は10桁以内で入力してください" });
    }

    // パスワード
    if (!data.password) {
      errors.push({ field: "password", message: "パスワードが未入力です" });
    } else if (data.password.length > 20) {
      errors.push({ field: "password", message: "パスワードは20桁以内で入力してください" });
    }

    // 権限
    if (!data.role) {
      errors.push({ field: "role", message: "権限が未入力です" });
    } else if (!["1", "2"].includes(data.role)) {
      errors.push({ field: "role", message: "権限は'1'か'2'を指定してください" });
    }

    return errors;
  }
}

export default UserController;
