import AuthService from "../services/AuthService.js";

class AuthController {

  async login(req, res) {
    // リクエストボディ取得
    const reqBody = req.body;

    let status = 200;
    try {
      const user = await AuthService.login(reqBody.userId, reqBody.password);
      if (user) {
        // 認証成功時アクセストークンを送信
        res.status(status).json(user);
      } else if (user == null) {
        // 認証失敗時ステータスに401を設定し送信
        status = 401;
        res.status(status).send();
      }
    } catch (e) {
      // 異常レスポンス
      console.log("failed to verify user.", e);
      status = 500;
      res.status(status).send();
    }
  }
}

export default new AuthController;
