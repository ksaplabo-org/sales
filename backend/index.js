// Business Logic define
const UsersLogic = require("./logic/users");

// DB Connection define
const DbUtil = require("./db/utility");
const db = DbUtil.connect();

// Express setting
const express = require("express");
const { json } = require("body-parser");
const cors = require("cors");
const app = express();

app.use(json());
app.use(cors());
app.listen(process.env.PORT || 3000);

/**
 * ログインAPI
 */
app.post("/api/log-in", async function (req, res) {
  // リクエストボディ取得
  const reqBody = req.body;

  let resBody = null;
  let status = 200;

  try {
    const user = await UsersLogic.findByUserId(db, reqBody.userId);

    if (user == null) {
      // 認証失敗として401エラーを設定(ユーザーが存在しない)
      status = 401;
    } else if (user.user_pass != reqBody.userPass) {
      // 認証失敗として401エラーを設定(パスワードが不一致)
      status = 401;
    } else {
      // 認証成功としてレスポンスボディを設定
      resBody = {
        id: user.id,
        userName: user.user_name,
        userRole: user.user_role,
      };
    }
  } catch (e) {
    // 異常レスポンス
    console.log("failed to verify user.", e);
    status = 500;
  }
  res.status(status).send(resBody);
});
