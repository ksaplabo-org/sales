import apiClient from "./axios";

/**
 * 取引先情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns 取引先情報一覧
 */
export async function getClients(condition) {
  const response = await apiClient.get("/clients", { params: condition });
  return response.data;
}
