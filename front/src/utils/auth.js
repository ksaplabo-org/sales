import * as UserConst from "@/constants/users";
import * as authApi from "@/api/authApi.js";

/**
 * セッションストレージに保持するキー
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
    // 認証
    const response = await authApi.login(userId, password);

    // 認証したユーザー情報をセッションストレージに保持することでログイン状態として扱う
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(response));
  } catch (e) {
    throw e;
  }
}

/**
 * ログアウト
 */
export function logout() {
  // セッションストレージからログイン情報を削除することでログアウトとする
  sessionStorage.removeItem(AUTH_KEY);
}

/**
 * ログインユーザー情報を取得
 *
 * @returns ログインうユーザー情報
 */
export function getLoginInfo() {
  // セッションストレージからログインユーザー情報を取得する
  const storageAuth = sessionStorage.getItem(AUTH_KEY);
  return storageAuth === null ? null : JSON.parse(storageAuth);
}

/**
 * ログイン判定
 *
 * @returns true:ログイン済 / false:未ログイン
 */
export function isLogin() {
  return getLoginInfo() !== null;
}

/**
 * 管理者判定
 *
 * @returns 管理者かどうか (true:管理者 false:一般)
 */
export function isAdmin() {
  const userInfo = getLoginInfo();
  return userInfo !== null && userInfo.auth === UserConst.Auth.admin;
}
