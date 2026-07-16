import axios from "axios";

//
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: 認証の共通アクセストークンが必要などあればこちらで。

// TODO:インターセプターでエラーハンドリングを共通化する？

export default apiClient;
