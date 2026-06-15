/**
 * 日時をyyyy/MM/dd hh:mm:ss形式に変換する
 *
 * @param {Date} value フォーマットする日付
 * @returns yyyy/MM/dd hh:mm:ss形式にフォーマットした文字列
 */
export const formatDatetime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
};
