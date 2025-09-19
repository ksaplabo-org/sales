// Business Logic define
const UsersLogic = require("./logic/users");
const ClientsLogic = require("./logic/clients");
const ProductsLogic = require("./logic/products");
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
    if (user == null || user.user_pass !== reqBody.userPass) {
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
 * 顧客情報登録API
 */
app.post("/api/clients", async function (req, res) {
  // リクエストボディ取得
  const reqBody = req.body;

  try {
    const createResult = await ClientsLogic.create(
      db,
      reqBody.name,
      reqBody.postCode,
      reqBody.address1,
      reqBody.address2,
      reqBody.telNo,
      reqBody.updateId,
      reqBody.entryId
    );
    //顧客番号が上限を超えているか判定
    if (createResult === 400) {
      res.status(400).send();
    } else {
      res.send();
    }
  } catch (e) {
    // 異常レスポンス
    console.log("failed to add clients.", e);
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
    res.status(500).send("受注情報取得処理に失敗しました");
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
    console.log("failed to get order.", e);
    res.status(500).send("server error occur");
  }
});

/**
 * 受注情報登録API
 */
app.post("/api/orders", async function (req, res) {
  const reqBody = req.body;

  try {
    const result = await OrdersLogic.create(
      db,
      reqBody.clientNo,
      reqBody.orderDate,
      reqBody.shipDate,
      reqBody.deliverDate,
      reqBody.productCode,
      reqBody.amount,
      reqBody.updateId,
      reqBody.entryId
    );
    if (result) {
      res.send();
    } else {
      res.send("一日の登録上限を超えています");
    }
  } catch (e) {
    // 異常レスポンス
    console.log("failed to add order.", e);
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
      reqBody.updateId
    );
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    console.log("failed to edit order", e);
    res.status(500).send("server error occur");
  }
});

/*
 * 受注情報削除
 */
app.delete("/api/orders/:orderNo", async function (req, res) {
  try {
    await OrdersLogic.delete(db, req.params.orderNo);
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    console.log("failed to delete order", e);
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
    console.log("failed to get products.", e);
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
    console.log("failed to get product.", e);
    res.status(500).send("server error occur");
  }
});



/**
 * ユーザー情報全件取得API
 */
app.get("/api/users", async function (req, res) {
  try {
    const users = await UsersLogic.getAll(db);
    res.send({
      Items: JSON.stringify(users),
    });
  } catch (e) {
    // 異常レスポンス
    console.log("failed to get users.", e);
    res.status(500).send("ユーザー情報取得処理に失敗しました");
  }
});


/**
 * ユーザー情報取得API
 */
app.get("/api/users/:id", async function (req, res) {
  try {
    const users = await UsersLogic.findByid(db, req.params.id);

    //正常レスポンス
    res.send({
      Items: JSON.stringify(users),
    });
  } catch (e) {
    //異常レスポンス
    console.log("failed to get user.", e);
    res.status(500).send("server error occur");
  }
});


/**
 * ユーザー情報削除API
 */
app.delete("/api/users/:id", async function (req, res) {
  try {
    await UsersLogic.delete(db, req.params.id);
    //正常レスポンス
    res.send();
  } catch (e) {
    //異常レスポンス
    console.log("failed to delete user", e);
    res.status(500).send("server error occur");
  }
});
