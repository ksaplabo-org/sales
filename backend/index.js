// Business Logic define
const UsersLogic = require("./logic/users");
const ClientsLogic = require("./logic/clients");
const OrdersLogic = require("./logic/orders");

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

    if (user == null || user.user_pass != reqBody.userPass) {
      // 認証失敗として401エラーを設定(ユーザーが存在しない、または、パスワード不一致)
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
 * 顧客情報全件取得API
 */
app.get("/api/clients", async function (req, res) {
  try {
    const clients = await ClientsLogic.getAll(db);
    res.send({
      Items: JSON.stringify(clients),
    });
  } catch (e) {
    // 異常レスポンス
    console.log("failed to get clients.", e);
    res.status(500).send("顧客情報取得処理に失敗しました");
  }
});

/**
 * 顧客情報登録API
 */
app.post("/api/clients", async function (req, res) {
  // リクエストボディ取得
  const reqBody = req.body;

  try {
    const maxClientNo = await ClientsLogic.getMaxClientNo(db);

    //顧客番号が上限を超えているか判定
    if (maxClientNo >= 99999999) {
      res.status(400).send();
    } else {
      const clientNo = maxClientNo + 1;
      await ClientsLogic.create(
        db,
        clientNo,
        reqBody.name,
        reqBody.postCode,
        reqBody.address1,
        reqBody.address2,
        reqBody.telNo,
        reqBody.updateId,
        reqBody.entryId
      );
      res.send();
    }
  } catch (e) {
    // 異常レスポンス
    console.log("failed to add client.", e);
    res.status(500).send("server error occur");
  }
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
 * 顧客情報削除API
 */
app.delete("/api/clients/:clientNo", async function (req, res) {
  try {
    await ClientsLogic.delete(db, req.params.clientNo);
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    if (e.parent.errno == DbUtil.ErrorCode.foreignKeyConstraint) {
      // 受注情報が削除しようとしてる顧客番号を参照している場合
      res.status(422).send("unable to delete");
    } else {
      console.log("failed to delete order.", e);
      res.status(500).send("server error occur");
    }
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

/**
 * 受注情報全件取得API
 */
app.get("/api/orders", async function (req, res) {
  try {
    const orders = await OrdersLogic.getAll(db);
    res.send({
      Items: JSON.stringify(orders),
    });
  } catch (e) {
    // 異常レスポンス
    console.log("failed to get orders.", e);
    res.status(500).send("server error occur");
  }
});
