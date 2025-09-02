// Ajax通信ライブラリ
import axios from "axios";

export async function signIn(userId, password) {
  const url = "/api/sign-in";

  return await axios.post(url, {
    userId: userId,
    password: password,
  });
}

export async function postClients(clientsModel) {
  const url = "/api/clients";

  return await axios.post(url, {
    name: clientsModel.name,
    postCode: clientsModel.postCode,
    address1: clientsModel.address1,
    address2: clientsModel.address2,
    telNo: clientsModel.telNo,
    updateId: UserUtil.currentUserInfo().id,
    entryId: UserUtil.currentUserInfo().id,
  });
}