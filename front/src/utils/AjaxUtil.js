// Ajax通信ライブラリ
import axios from "axios";

export async function logIn(userId, userPass) {
  const url = "/api/log-in";

  return await axios.post(url, {
    userId: userId,
    userPass: userPass,
  });
}

export async function getOrders() {
  const url = "/api/orders";
  return await axios.get(url);
}
