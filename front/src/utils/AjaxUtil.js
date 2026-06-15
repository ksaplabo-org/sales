// Ajax通信ライブラリ
import axios from "axios";

export async function login(userId, password) {
  const url = "/api/login";

  return await axios.post(url, {
    userId: userId,
    password: password,
  });
}
