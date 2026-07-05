/**
 *  メッセージの埋め込み文字を変換する
 * 
 * @param {*} message メッセージ
 * @param  {...any} args 埋め込み文字
 * @returns 埋め込み文字を変換したメッセージ
 */
export const formatMessage = (message, ...args) => {
  return message.replace(/\{(\d+)\}/g, (_, index) => {
    return args[index] ?? "";
  });
};
