import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "./const/UserConst";

/**
 * SessionStorageに保持すログインユーザー情報のキー
 */
const LOGIN_KEY = "logInUser";

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
 * ログアウト
 */
export function deleteCurrentUserInfo() {
  // SessionStorageから、ログインユーザー情報を削除する
  sessionStorage.removeItem(LOGIN_KEY);
}

/**
 * ログイン判定
 *
 * @returns ログイン有無
 */
export function isLogIn() {
  return currentUserInfo() !== null;
}
