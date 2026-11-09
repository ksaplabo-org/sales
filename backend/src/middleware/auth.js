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

/**
 * 権限チェック検証
 *
 * @param {*} roles API実行権限情報
 */
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // ルート定義内のAPIの要求権限とログインユーザーの権限の照合
    if (!roles.includes(req.user.role)) {
      // 認可チェックエラー
      return res.status(403).send();
    }

    next();
  };
};

export { authorizeRole };
export default authenticateToken;
