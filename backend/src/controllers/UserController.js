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
      // 各種チェック
      await this.service.insert(req.body);
      res.status(201).send();
    } catch (e) {
      console.log(e);
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
      // 各種チェック
      await this.service.update(req.params.userId, req.body);
      res.status(200).send();
    } catch (e) {
      console.log(e);
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
}

export default UserController;
