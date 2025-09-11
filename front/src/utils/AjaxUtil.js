// Ajax通信ライブラリ
import axios from "axios";

export async function logIn(userId, userPass) {
  const url = "/api/log-in";

  return await axios.post(url, {
    userId: userId,
    userPass: userPass,
  });
}

export async function getClients() {
  const url = "/api/clients";
  return await axios.get(url);
}

//顧客更新
export async function putClients(clientsModel) {
  const url = "/api/clients";
  return await axios.put(url, {
    clientNo: clientsModel.clientNo,
    name: clientsModel.name,
    postCode: clientsModel.postCode,
    address1: clientsModel.address1,
    address2: clientsModel.address2,
    telNo: clientsModel.telNo,
    updateId: clientsModel.updateId,
  });
}

//顧客情報を顧客番号で検索
export async function getClientsByClientNo(clientNo) {
  const url = "/api/clients/" + clientNo;
  return await axios.get(url);
}
