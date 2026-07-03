import apiClient from "./axios";

/*
 * ユーザー検索
 */
export const searchUsers = async (condition) => {
  const response = await apiClient.get("/users");
  return response.data;
};

/**
 * ユーザー検索
 *
 * @param {*} condition
 * @returns ユーザー一覧
 */
export async function findUsers(condition) {
  return await apiClient.get("/users", { params: condition });
}

/**
 * ユーザー削除
 *
 * @param {*} userId ユーザーID
 * @returns
 */
export async function deleteUser(userId) {
  return await apiClient.delete(`/users/${userId}`);
}
