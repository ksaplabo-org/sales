// Business Logic define
const UsersLogic = require("./logic/users");
const ClientsLogic = require("./logic/clients");
const OrdersLogic = require("./logic/orders");
const ProductsLogic = require("./logic/products");

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
    console.log("failed to verify user.", e);
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
    await ClientsLogic.create(
      db,
      reqBody.name,
      reqBody.postCode,
      reqBody.address1,
      reqBody.address2,
      reqBody.telNo,
      reqBody.updateId,
      reqBody.entryId
    );
    console.log("errtest");
    res.send();
  } catch (e) {
    // 異常レスポンス
    console.log("failed to add clients.", e);
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
    console.log("failed to edit client", e);
    res.status(500).send("server error occur");
  }
});


/**
 * 受注情報取得API
 */
app.get("/api/orders/:orderNo", async function (req, res) {
  try {
    const order = await OrdersLogic.findByOrderNo(db, req.params.orderNo);

    //正常レスポンス
    res.send({
      Items: JSON.stringify(order),
    });
  } catch (e) {
    //異常レスポンス
    console.log("failed to get client.", e);
    res.status(500).send("server error occur");
  }
});

/**
 * 受注情報修正API
 */
app.put("/api/orders", async function (req, res) {
  const reqBody = req.body;
  try {
    await OrdersLogic.edit(
      db,
      reqBody.orderNo,
      reqBody.orderDate,
      reqBody.shipDate,
      reqBody.deliverDate,
      reqBody.productCode,
      reqBody.amount,
      reqBody.updateId,
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
 * 商品情報全件取得API
 */
app.get("/api/products", async function (req, res) {
  try {
    const products = await ProductsLogic.getAll(db);
    res.send({
      Items: JSON.stringify(products),
    });
  } catch (e) {
    // 異常レスポンス
    console.log("failed to verify user.", e);
    res.status(500).send("商品情報取得処理に失敗しました");
  }
});

/**
 * 商品情報取得API
 */
app.get("/api/products/:productCode", async function (req, res) {
  try {
    const product = await ProductsLogic.findByProductCode(db, req.params.productCode);

    //正常レスポンスProductsLogic
    res.send({
      Items: JSON.stringify(product),
    });
  } catch (e) {
    //異常レスポンス
    console.log("failed to get client.", e);
    res.status(500).send("server error occur");
  }
});