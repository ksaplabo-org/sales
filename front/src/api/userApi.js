import apiClient from "./apiClient";

/**
 * ユーザー情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns ユーザー情報一覧
 */
export const getUsers = async (condition) => {
  const response = await apiClient.get("/users", { params: condition });
  return response.data;
};

/**
 * ユーザー情報詳細取得API呼び出し
 *
 * @param {*} userId ユーザーID
 * @returns ユーザー情報
 */
export const getUserByUserId = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * ユーザー情報登録
 *
 * @param {*} userInfo ユーザー情報
 */
export const createUser = async (userInfo) => {
  await apiClient.post("/users", userInfo);
};

/**
 * ユーザー情報更新
 *
 * @param {*} userInfo ユーザー情報
 */
export const updateUser = async (userInfo) => {
  await apiClient.put(`/users/${userInfo.userId}`, userInfo);
};

/**
 * ユーザー情報削除
 *
 * @param {*} userId ユーザーID
 */
export const deleteUser = async (userId) => {
  await apiClient.delete(`/users/${userId}`);
};
