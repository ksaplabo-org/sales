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

//受注情報を伝票番号で検索
export async function getOrdersByOrderNo(orderNo) {
  const url = "/api/orders/" + orderNo;
  return await axios.get(url);
}

//受注情報削除
export async function deleteOrders(orderNo) {
  const url = "/api/orders/" + orderNo;
  return await axios.delete(url);
}
