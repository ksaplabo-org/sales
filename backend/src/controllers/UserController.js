import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import userService from "../services/UserService.js";

class UserController {
  /**
   * ユーザー情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  findAll = async (req, res) => {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        userId: req.query.userId,
        userName: req.query.userName,
        role: req.query.role,
        includeDeleted: req.query.includeDeleted === "true",
      };

      // ユーザー情報一覧検索
      const users = await userService.findAll(condition);
      res.json(users);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  };

  /**
   * ユーザー情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  findById = async (req, res) => {
    try {
      const user = await userService.findById(req.params.userId);
      res.json(user);
    } catch (err) {
      console.error(err);

      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  };

  /**
   * ユーザー情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  create = async (req, res) => {
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
        updatedId: req.body.createdId,
      };

      // 共通バリデーション
      const errors = this.validate(user);

      // 権限
      if (!user.role) {
        errors.push({ field: "role", message: "権限が設定されていません" });
      } else if (!["1", "2"].includes(user.role)) {
        errors.push({ field: "role", message: "権限は'1'か'2'を設定してください" });
      }

      // 登録者ID
      if (!user.createdId) {
        errors.push({ field: "createdId", message: "登録者IDが設定されていません" });
      } else if (user.createdId.length > 6) {
        errors.push({ field: "createdId", message: "登録者IDは6桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(user.createdId)) {
        errors.push({ field: "createdId", message: "登録者IDは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        // 登録処理実行
        await userService.create(user);
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
  };

  /**
   * ユーザー情報更新
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  update = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = {
        userId: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        birthday: req.body.birthday,
        updatedId: req.body.updatedId,
      };

      // 共通バリデーション
      const errors = this.validate(user);

      // 更新者ID
      if (!user.updatedId) {
        errors.push({ field: "updatedId", message: "更新者IDが設定されていません" });
      } else if (user.updatedId.length > 6) {
        errors.push({ field: "updatedId", message: "更新者IDは6桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(user.updatedId)) {
        errors.push({ field: "updatedId", message: "更新者IDは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
      } else {
        await userService.update(userId, req.body);
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
  };

  /**
   * ユーザー情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  delete = async (req, res) => {
    try {
      await userService.delete(req.params.userId);
      res.send();
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  };

  /**
   * 登録・更新共通バリデーション
   *
   * @param {*} data 登録データ
   * @returns エラー情報配列(空の場合はエラーなし)
   */
  validate = (data) => {
    const errors = [];

    // ユーザーID
    if (!data.userId) {
      errors.push({ field: "userId", message: "ユーザーIDが設定されていません" });
    } else if (data.userId.length != 6) {
      errors.push({ field: "userId", message: "ユーザーIDは6桁で設定してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.userId)) {
      errors.push({ field: "userId", message: "ユーザーIDは半角英数で設定してください" });
    }

    // 姓
    if (!data.lastName) {
      errors.push({ field: "lastName", message: "姓が設定されていません" });
    } else if (data.lastName.length > 10) {
      errors.push({ field: "lastName", message: "姓は10桁以内で設定してください" });
    }

    // 名
    if (!data.firstName) {
      errors.push({ field: "firstName", message: "名が設定されていません" });
    } else if (data.firstName.length > 10) {
      errors.push({ field: "firstName", message: "名は10桁以内で設定してください" });
    }

    // パスワード
    if (!data.password) {
      errors.push({ field: "password", message: "パスワードが設定されていません" });
    } else if (data.password.length > 20) {
      errors.push({ field: "password", message: "パスワードは20桁以内で設定してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.password)) {
      errors.push({ field: "password", message: "パスワードは半角英数で設定してください" });
    }
    return errors;
  };
}

export default new UserController();
