// Ajax通信ライブラリ
import axios from "axios";

export async function signIn(userId, password) {
  const url = "/api/sign-in";

  return await axios.post(url, {
    userId: userId,
    password: password,
  });
}
