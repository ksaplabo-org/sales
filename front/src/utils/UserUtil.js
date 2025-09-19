import UserConst from "./const/UserConst";

/**
 * ログアウト
 */
export function deleteCurrentUserInfo() {
  // SessionStorageから、ログインユーザー情報を削除する
  sessionStorage.removeItem(UserConst.SessionKey);
}

/**
 * ユーザー情報取得
 *
 * @returns ログインユーザー情報
 */
export function currentUserInfo() {
  // SessionStorageから、ログインユーザー情報を取得する
  const logInUser = sessionStorage.getItem(UserConst.SessionKey);
  
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

