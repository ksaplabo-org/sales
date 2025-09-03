// Ajax通信ライブラリ
import axios from "axios";

export async function signIn(userId, password) {
  const url = "/api/sign-in";

  return await axios.post(url, {
    userId: userId,
    password: password,
  });
}

//顧客情報を顧客番号で検索
export async function getClientsByClientNo(clientNo) {
  const url = "/api/clients/" + clientNo;
  return await axios.get(url);
}

//顧客情報削除
export async function deleteClients(clientNo) {
  const url = "/api/clients/" + clientNo;
  return await axios.delete(url);
}

