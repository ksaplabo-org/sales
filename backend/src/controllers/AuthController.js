import AuthService from "../services/AuthService.js";

class AuthController {
  service = new AuthService();

  async login(req, res) {
    // リクエストボディ取得
    const reqBody = req.body;

    let status = 200;
    try {
      const user = await this.service.login(reqBody.userId, reqBody.password);
      if (user) {
        res.status(status).json(user);
      }else if(user == null){
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

export default AuthController;
