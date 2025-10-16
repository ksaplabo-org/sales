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
      console.log("failed to delete client.", e);
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
    res.sendStatus(500);
  }
});

/**
 * 受注情報登録API
 */
app.post("/api/orders", async function (req, res) {
  const reqBody = req.body;

  //伝票番号採番
  try {
    //最新の伝票番号取得
    const latestOrderNo = await OrdersLogic.getLatestOrderNo(db);
    //伝票番号日付部分
    const latestOrderNoDate = latestOrderNo.substring(0, 8);
    //伝票番号連番部分
    const latestOrderSeqNo = latestOrderNo.substring(8);
    const date = new Date();
    const month = date.getMonth() + 1;
    //本日の日付をyyyyMMdd形式にする
    const formattedDate =
      date.getFullYear() + month.toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0");

    //連番
    let seqNo = 1;
    //最新の伝票番号の日付部分が本日の日付と一致した場合
    if (latestOrderNoDate == formattedDate) {
      //最新の伝票番号の連番が99の場合
      if (latestOrderSeqNo == "99") {
        //1日の最大登録数を超過するため400ステータスコードでレスポンスする
        res.sendStatus(400);
        return;
      }
      //連番を最新の伝票番号の連番+1に設定
      seqNo = parseInt(latestOrderSeqNo) + 1;
    }
    //yyyyMMdd + 連番を伝票番号とする
    const orderNo = formattedDate + seqNo.toString().padStart(2, "0");

    await OrdersLogic.create(
      db,
      orderNo,
      reqBody.clientNo,
      reqBody.orderDate,
      reqBody.shipDate,
      reqBody.deliverDate,
      reqBody.productCode,
      reqBody.amount,
      reqBody.updateId,
      reqBody.entryId
    );
    res.send();
  } catch (e) {
    // 異常レスポンス
    console.log("failed to add orders.", e);
    res.sendStatus(500);
  }
});

/**
 * 受注情報取得API(伝票番号と一致)
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
    res.sendStatus(500);
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
    res.sendStatus(500);
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
    console.log("failed to get product.", e);
    res.sendStatus(500);
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
    res.sendStatus(500);
    res.sendStatus(500);
  }
});
