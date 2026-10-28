import axios from "axios";

//
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエスト時に最新のアクセストークンを設定
apiClient.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// TODO: 認証の共通アクセストークンが必要などあればこちらで。

// TODO:インターセプターでエラーハンドリングを共通化する？

export default apiClient;
