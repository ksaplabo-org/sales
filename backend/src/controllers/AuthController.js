import AuthService from "../services/AuthService.js";

class AuthController {
  service = new AuthService();

  async login(req, res) {
    // リクエストボディ取得
    const reqBody = req.body;

    let resBody = null;
    let status = 200;
    try {
      const user = await this.service.login(reqBody.userId, reqBody.password);
      if (user == null) {
        // 認証失敗として401エラーを設定
        status = 401;
      } else {
        // 認証成功としてレスポンスボディを設定
        resBody = {
          userId: user.userId,
          role: user.role,
        };
      }
    } catch (e) {
      // 異常レスポンス
      console.log("failed to verify user.", e);
      status = 500;
    }
    res.status(status).json(resBody);
  }
}

export default AuthController;
