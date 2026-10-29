import * as UserConst from "@/constants/users";
import * as authApi from "@/api/authApi.js";
import { jwtDecode } from "jwt-decode";

/**
 * セッションストレージに保持するキー
 */
const AUTH_KEY = "accessToken";
// デコードしたログインユーザー情報を保持する変数
let loginInfo = null;

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

    // 認証したアクセストークンをセッションストレージに保持することでログイン状態として扱う
    sessionStorage.setItem(AUTH_KEY, response);
    // デコードしたログインユーザー情報をクリア
    loginInfo = null;
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
  // デコードしたログインユーザー情報を削除することでログアウトとする
  loginInfo = null;
}

/**
 * ログインユーザー情報を取得
 *
 * @returns ログインユーザー情報
 */
export function getLoginInfo() {
  // 既にデコード済みならその値を返却
  if (loginInfo !== null) {
    return loginInfo;
  }

  // セッションストレージからアクセストークンを取得
  const storageAuth = sessionStorage.getItem(AUTH_KEY);

  // 取得できなかった場合
  if (storageAuth === null) {
    return null;
  }

  // 初回のみデコード実行
  loginInfo = jwtDecode(storageAuth);
  return loginInfo;
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
  return userInfo !== null && userInfo.role === UserConst.ROLES.ADMIN;
}
