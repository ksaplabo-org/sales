// Business Logic define
const UserLogic = require("./logic/user");
const ClientsLogic = require("./logic/clients");

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
 * サインインAPI
 */
app.post("/api/sign-in", async function (req, res) {
  // リクエストボディ取得
  const reqBody = req.body;

  let resBody = null;
  let status = 200;
  try {
    const user = await UserLogic.findById(db, reqBody.userId);
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
});

/**
 * 顧客情報取得API
 */
app.get("/api/clients/:clientNo", async function (req, res) {
  try {
    const clients = await ClientsLogic.findByClientNo(db, req.params.clientNo);

    //正常レスポンス
    res.send({
      Items: JSON.stringify(clients),
    });
  } catch (e) {
    //異常レスポンス
    console.log("failed to get client.", e);
    res.status(500).send("server error occur");
  }
});

/**
 * 顧客情報削除API
 */
app.delete("/api/clients/:clientNo", async function (req, res) {
  try {
    await ClientsLogic.delete(db, req.params.clientNo);
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    console.log("failed to edit client", e);
    res.status(500).send("server error occur");
  }
});
