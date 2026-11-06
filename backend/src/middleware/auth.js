import jwt from "jsonwebtoken";

// Authorizationヘッダーで使用するBearer認証スキーム
const AUTH_SCHEME_BEARER = "Bearer ";

  /**
   * アクセストークン検証
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   * @param {*} next 後続処理
   */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Bearer認証の形式チェック
  if (!authHeader?.startsWith(AUTH_SCHEME_BEARER)) {
    return res.status(401).send();
  }

  // Bearerを空文字に置換し、アクセストークンのみ取得
  const token = authHeader.replace(AUTH_SCHEME_BEARER, "");

  try {
    // アクセストークンの検証
    const loginInfo = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: loginInfo.userId,
      role: loginInfo.role,
    };

    next();
  } catch {
    // 認証チェックエラー
    res.status(401).send();
  }
};

export default authenticateToken;
