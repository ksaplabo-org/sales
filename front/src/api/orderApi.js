import apiClient from "./axios";

/**
 * 受発注情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns 受発注情報一覧
 */
export async function getOrders(condition) {
  const response = await apiClient.get("/orders", { params: condition });
  return response.data;
}

/**
 * 受発注情報詳細取得API呼び出し
 *
 * @param {*} OrderNo 受発注番号
 * @returns 受発注情報
 */
export async function getOrderByOrderNo(orderNo) {
  const response = await apiClient.get(`/orders/${orderNo}`);
  return response.data;
}

/**
 * 受発注情報登録
 *
 * @param {*} OrderInfo 受発注情報
 */
export async function createOrder(orderInfo) {
  await apiClient.post("/orders/", orderInfo);
}

/**
 * 受発注情報更新
 *
 * @param {*} OrderInfo 受発注情報
 */
export async function editOrder(orderInfo) {
  await apiClient.put(`/orders/${orderInfo.orderNo}`, orderInfo);
}

/**
 * 受発注情報削除
 *
 * @param {*} OrderNo 受発注番号
 */
export async function deleteOrder(orderNo) {
  await apiClient.delete(`/orders/${orderNo}`);
}
