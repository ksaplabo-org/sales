import apiClient from "./axios";

/**
 * お知らせ情報一覧取得API呼び出し
 *
 * @param {*} condition 検索条件
 * @returns お知らせ情報一覧
 */
export async function getNotices(condition) {
  const response = await apiClient.get("/notices", { params: condition });
  return response.data;
}

/**
 * お知らせID情報削除
 *
 * @param {*} noticeId お知らせID
 */
export async function deleteNotice(noticeId) {
  await apiClient.delete(`/notices/${noticeId}`);
}
