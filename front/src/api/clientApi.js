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

/**
 * 取引先情報詳細取得API呼び出し
 *
 * @param {*} clientCode 取引先コード
 * @returns 取引先情報
 */
export async function getClientByClientCode(clientCode) {
  const response = await apiClient.get(`/clients/${clientCode}`);
  return response.data;
}

/**
 * 取引先情報登録API呼び出し
 *
 * @param {*} clientInfo 取引先情報
 */
export async function createClient(clientInfo) {
  await apiClient.post("/clients/", clientInfo);
}

/**
 * 取引先情報更新
 *
 * @param {*} clientInfo 取引先情報
 */
export async function updateClient(clientInfo) {
  await apiClient.put(`/clients/${clientInfo.clientCode}`, clientInfo);
}
