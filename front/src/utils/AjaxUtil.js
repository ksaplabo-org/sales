// Ajax通信ライブラリ
import axios from "axios";
import * as UserUtil from "@/utils/UserUtil";

export async function logIn(userId, userPass) {
  const url = "/api/log-in";

  return await axios.post(url, {
    userId: userId,
    userPass: userPass,
  });
}

export async function getClients() {
  const url = "/api/clients";
  return await axios.get(url);
}
//顧客情報登録
export async function postClients(clientsModel) {
  const url = "/api/clients";
  const id = UserUtil.currentUserInfo().id;
  return await axios.post(url, {
    name: clientsModel.name,
    postCode: clientsModel.postCode,
    address1: clientsModel.address1,
    address2: clientsModel.address2,
    telNo: clientsModel.telNo,
    updateId: id,
    entryId: id,
  });
}

//顧客更新
export async function putClients(clientsModel) {
  const url = "/api/clients";
  return await axios.put(url, {
    clientNo: clientsModel.clientNo,
    name: clientsModel.name,
    postCode: clientsModel.postCode,
    address1: clientsModel.address1,
    address2: clientsModel.address2,
    telNo: clientsModel.telNo,
    updateId: clientsModel.updateId,
  });
}

//顧客情報削除
export async function deleteClients(clientNo) {
  const url = "/api/clients/" + clientNo;
  return await axios.delete(url);
}

//顧客情報を顧客番号で検索
export async function getClientsByClientNo(clientNo) {
  const url = "/api/clients/" + clientNo;
  return await axios.get(url);
}

//受注情報を伝票番号を元に取得
export async function getOrdersByOrderNo(orderNo) {
  const url = "/api/orders/" + orderNo;
  return await axios.get(url);
}

//受注情報更新
export async function putOrders(ordersModel) {
  const url = "/api/orders";
  return await axios.put(url, {
    orderNo: ordersModel.orderNo,
    orderDate: ordersModel.orderDate,
    shipDate: ordersModel.shipDate,
    deliverDate: ordersModel.deliverDate,
    productCode: ordersModel.productCode,
    amount: ordersModel.amount,
    updateId: ordersModel.updateId,
  });
}
// 受注情報全件検索
export async function getOrders() {
  const url = "/api/orders";
  return await axios.get(url);
}

//受注情報登録
export async function postOrders(ordersModel) {
  const url = "/api/orders/";
  return await axios.post(url, {
    clientNo: ordersModel.clientNo,
    orderDate: ordersModel.orderDate,
    shipDate: ordersModel.shipDate,
    deliverDate: ordersModel.deliverDate,
    productCode: ordersModel.productCode,
    amount: ordersModel.amount,
    updateId: ordersModel.updateId,
    entryId: ordersModel.entryId,
  });
}

// 商品情報全件取得処理
export async function getProducts() {
  const url = "/api/products/";
  return await axios.get(url);
}

// 商品情報を商品コードで検索
export async function getProductsByProductCode(productCode) {
  const url = "/api/products/" + productCode;
  return await axios.get(url);
}


//商品情報削除
export async function deleteProducts(productCode) {
  const url = "/api/products/" + productCode;
  return await axios.delete(url);
}

//受注情報削除
export async function deleteOrders(orderNo) {
  const url = "/api/orders/" + orderNo;
  return await axios.delete(url);
}

//　発注日について年月の範囲を指定し受注情報を検索する処理
export async function findByOrderDateYM(orderDateYM) {
  const url = "/api/orders";
  return await axios.get(url, {
    params: {
      orderDateYM: orderDateYM,
    },
  });
}

// ユーザー情報全件取得処理
export async function getUsers() {
  const url = "/api/users";
  return await axios.get(url);
}

//ユーザー情報をユーザーIDで検索
export async function getUsersByUserId(userId) {
  const url = "/api/users";
  return await axios.get(url, {
    params: {
      userId: userId,
    },
  });
}

// ユーザー情報登録
export async function postUsers(usersModel) {
  const url = "/api/users";
  const currentId = UserUtil.currentUserInfo().id;
  return await axios.post(url, {
    userId: usersModel.userId,
    userPass: usersModel.userPass,
    userName: usersModel.userName,
    userRole: usersModel.userRole,
    updateId: currentId,
    entryId: currentId,
  });
}
