import apiClient from "./axios";

/**
 * 商品情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns ユーザー情報一覧
 */
export async function getProducts(condition) {
  const response = await apiClient.get("/products", { params: condition });
  return response.data;
}

/**
 * 商品情報詳細取得API呼び出し
 *
 * @param {*} productCode ユーザーID
 * @returns 商品情報
 */
export async function getProductByProductId(productCode) {
  const response = await apiClient.get(`/users/${productCode}`);
  return response.data;
}

/**
 * 商品情報登録
 *
 * @param {*} productInfo 商品情報
 */
export async function createUser(productInfo) {
  await apiClient.post("/users/", productInfo);
}

/**
 * 商品情報更新
 *
 * @param {*} productInfo 商品情報
 */
export async function editProduct(productInfo) {
  await apiClient.put(`/products/${productInfo.productCode}`, productInfo);
}

/**
 * 商品情報削除
 *
 * @param {*} productId ユーザーID
 */
export async function deleteUser(productCode) {
  await apiClient.delete(`/products/${productCode}`);
}
