import UserService from "../services/UserService.js";

class UserController {
  service = new UserService();

  async find(req, res) {
    try {
      const condition = {
        userId: req.query.userId,
        userName: req.query.userName,
        role: req.query.role,
        includeDeleted: req.query.includeDeleted === "true",
      };

      const users = await this.service.find(condition);
      res.json(users);
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async findById(req, res) {
    try {
      const user = await this.service.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async delete(req, res) {
    try {
      // 必須チェック
      console.log(req.params);
      const userId = req.params.userId;
      await this.service.delete(userId);
      res.status(200).json();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(req, res) {
    // リクエストボディ取得
    const reqBody = req.body;

    let resBody = null;
    let status = 200;
    console.log(reqBody);
    try {
      const user = await this.service.findById(reqBody.userId);
      if (user == null || user.password !== reqBody.password) {
        // 認証失敗として401エラーを設定
        status = 401;
      } else {
        // 認証成功としてレスポンスボディを設定
        resBody = {
          userId: user.user_id,
          userName: user.user_name,
          auth: user.auth,
        };
      }
    } catch (e) {
      // 異常レスポンス
      console.log("failed to verify user.", e);
      status = 500;
    }
    res.status(status).send(resBody);
  }
}

export default UserController;
