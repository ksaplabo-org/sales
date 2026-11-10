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

export default authorizeRole ;