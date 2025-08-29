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
 * ログイン判定
 *
 * @returns ログイン有無
 */
export function isLogIn() {
  return currentUserInfo() !== null;
}

/**
 * 権限判定
 * @returns 権限 (0:一般 1:管理者 2:役職 )
 */
export function roleCheck() {
  const userInfo = currentUserInfo();
  if (userInfo !== null && userInfo.userRole == UserConst.Role.general) {
    return UserConst.Role.general;
  } else if (userInfo !== null && userInfo.userRole == UserConst.Role.admin) {
    return UserConst.Role.admin;
  } else if (userInfo !== null) {
    return UserConst.Role.post;
  }
}
