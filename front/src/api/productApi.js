import apiClient from "./axios";

/**
 * ユーザー情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns ユーザー情報一覧
 */
export async function getproducts(condition) {
  const response = await apiClient.get("/products", { params: condition });
  return response.data;
}

/**
 * ユーザー情報詳細取得API呼び出し
 *
 * @param {*} productId ユーザーID
 * @returns ユーザー情報
 */
export async function getProductByProductId(productId) {
  const response = await apiClient.get(`/users/${productId}`);
  return response.data;
}

/**
 * ユーザー情報登録
 *
 * @param {*} productInfo ユーザー情報
 */
export async function createUser(productInfo) {
  await apiClient.post("/users/", productInfo);
}

/**
 * ユーザー情報更新
 *
 * @param {*} productInfo ユーザー情報
 */
export async function editProduct(productInfo) {
  await apiClient.put(`/products/${productInfo.productId}`, productInfo);
}

/**
 * ユーザー情報削除
 *
 * @param {*} productId ユーザーID
 */
export async function deleteUser(productId) {
  await apiClient.delete(`/products/${productId}`);
}
