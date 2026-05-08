import * as UserConst from "@/constants/users";
import * as AjaxUtil from "@/utils/AjaxUtil";

/**
 * SessionStorageに保持するログインユーザー情報 のキー
 */
const AUTH_KEY = "loginKey";

/**
 * ログイン処理
 *
 * @param {*} userId ユーザーID
 * @param {*} password パスワード
 */
export async function login(userId, password) {
  try {
    const response = await AjaxUtil.login(userId, password);
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
  } catch (e) {
    throw e;
  }
}

/**
 * ログアウト
 */
export function logout() {
  // Sセッションストレージからログイン情報を削除する
  sessionStorage.removeItem(AUTH_KEY);
}

/**
 * ユーザー情報取得
 *
 * @returns サインインユーザー情報
 */
export function currentUserInfo() {
  // セッションストレージからログイン情報を取得する
  const storageAuth = sessionStorage.getItem(AUTH_KEY);
  return storageAuth === null ? null : JSON.parse(storageAuth);
}

/**
 * ログイン判定
 *
 * @returns true:ログイン済 / false:未ログイン
 */
export function isLogin() {
  return currentUserInfo() !== null;
}

/**
 * 管理者判定
 *
 * @returns 管理者かどうか (true:管理者 false:一般)
 */
export function isAdmin() {
  const userInfo = currentUserInfo();
  return userInfo !== null && userInfo.auth === UserConst.Auth.admin;
}
