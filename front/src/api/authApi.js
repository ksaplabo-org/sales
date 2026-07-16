import apiClient from "./apiClient";

/*
 * ログイン
 */
export const login = async (userId, password) => {
  const response = await apiClient.post("/login", {
    userId: userId,
    password: password,
  });
  return response.data;
};
