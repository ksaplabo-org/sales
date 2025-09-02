import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "./const/UserConst";

/**
 * SessionStorageに保持すログインユーザー情報のキー
 */
<<<<<<< HEAD
const LOGIN_KEY = "logInUser";
=======
const SIGN_IN_KEY = "signInUser";

/**
 * サインイン
 *
 * @param {*} userId ユーザーID
 * @param {*} password パスワード
 * @returns
 */
export async function signIn(userId, password) {
  try {
    const response = await AjaxUtil.signIn(userId, password);

    // SessionStorageに、サインインユーザー情報を保持する
    sessionStorage.setItem(SIGN_IN_KEY, JSON.stringify(response.data));
  } catch (e) {
    throw e;
  }
}

/**
 * ログアウト
 */
export function deleteCurrentUserInfo() {
  // SessionStorageから、ログインユーザー情報を削除する
  sessionStorage.removeItem(LOGIN_KEY);
}
>>>>>>> 33ee9c3e97bb1118caa3cb025d74fb116594241e

/**
 * ユーザー情報取得
 *
 * @returns ログインユーザー情報
 */
export function currentUserInfo() {
  // SessionStorageから、ログインユーザー情報を取得する
  const logInUser = sessionStorage.getItem(LOGIN_KEY);
  
  //logInUserがnullかどうか判定
  if (logInUser === null) {
    return null;
  } else {
    return JSON.parse(logInUser);
  }
}

/**
 * ログイン判定
 *
 * @returns ログイン有無
 */
export function isLogIn() {
  return currentUserInfo() !== null;
}

