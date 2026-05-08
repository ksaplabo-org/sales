/**
 * エラーログ出力
 *
 * @param {*} message メッセージ
 * @param {*} error エラー情報
 */
export function error(message, error) {
  let msg = `${message}`;
  if (error) {
    msg += `\n${error.stack}`;
  }
  console.error(msg);
}
