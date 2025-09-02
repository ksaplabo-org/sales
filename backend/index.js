// Business Logic define
const UsersLogic = require("./logic/users");
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
 * ログインAPI
 */
app.post("/api/log-in", async function (req, res) {
app.post("/api/log-in", async function (req, res) {
  // リクエストボディ取得
  const reqBody = req.body;

  let resBody = null;
  let status = 200;

  try {
    const user = await UsersLogic.findById(db, reqBody.userId);
    if (user == null || user.password !== reqBody.password) {
      // 認証失敗として401エラーを設定
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

/**
 * 顧客情報修正API
 */
app.put("/api/clients", async function (req, res) {
  const reqBody = req.body;
  try {
    await ClientsLogic.edit(
      db,
      reqBody.clientNo,
      reqBody.name,
      reqBody.postCode,
      reqBody.address1,
      reqBody.address2,
      reqBody.telNo,
      reqBody.updateId
    );
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    console.log("failed to edit client", e);
    res.status(500).send("server error occur");
  }
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
