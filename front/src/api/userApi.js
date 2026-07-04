import apiClient from "./axios";

/**
 * ユーザー情報一覧検索
 *
 * @param {*} condition
 * @returns ユーザー情報一覧
 */
export async function findUsers(condition) {
  return await apiClient.get("/users", { params: condition });
}

/**
 * ユーザー情報詳細検索
 *
 * @param {*} userId ユーザーID
 * @returns ユーザー情報
 */
export const findByUserId = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * ユーザー情報登録
 *
 * @param {*} userInfo ユーザー情報
 */
export async function createUser(userInfo) {
  await apiClient.post("/users/", userInfo);
}

/**
 * ユーザー情報更新
 *
 * @param {*} userInfo ユーザー情報
 */
export async function editUser(userInfo) {
  await apiClient.put(`/users/${userInfo.userId}`, userInfo);
}

/**
 * ユーザー情報削除
 *
 * @param {*} userId ユーザーID
 */
export async function deleteUser(userId) {
  await apiClient.delete(`/users/${userId}`);
}
