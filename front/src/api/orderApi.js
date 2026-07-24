import apiClient from "./axios";

/**
 * ユーザー情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns ユーザー情報一覧
 */
export async function getOrders(condition) {
  const response = await apiClient.get("/orders", { params: condition });
  return response.data;
}

/**
 * ユーザー情報詳細取得API呼び出し
 *
 * @param {*} OrderId ユーザーID
 * @returns ユーザー情報
 */
export async function getOrderByOrderId(orderNo) {
  const response = await apiClient.get(`/orders/${orderNo}`);
  return response.data;
}

/**
 * ユーザー情報登録
 *
 * @param {*} OrderInfo ユーザー情報
 */
export async function createOrder(orderInfo) {
  await apiClient.post("/orders/", orderInfo);
}

/**
 * ユーザー情報更新
 *
 * @param {*} OrderInfo ユーザー情報
 */
export async function editOrder(orderInfo) {
  await apiClient.put(`/orders/${orderInfo.orderNo}`, orderInfo);
}

/**
 * ユーザー情報削除
 *
 * @param {*} OrderId ユーザーID
 */
export async function deleteOrder(orderId) {
  await apiClient.delete(`/orders/${orderNo}`);
}
