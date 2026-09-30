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
 * お知らせ情報詳細取得API呼び出し
 *
 * @param {*} noticeId お知らせコード
 * @returns お知らせ情報
 */
export async function getNoticeByNoticeId(noticeId) {
  const response = await apiClient.get(`/notices/${noticeId}`);
  return response.data;
}

/**
 * お知らせ情報登録
 *
 * @param {*} noticeInfo お知らせ情報
 */
export async function createNotice(noticeInfo) {
  await apiClient.post("/notices", noticeInfo);
}

/**
 * お知らせ情報更新
 *
 * @param {*} noticeInfo お知らせ情報
 */
export async function updateNotice(noticeInfo) {
  await apiClient.put(`/notices/${noticeInfo.noticeId}`, noticeInfo);
}

/**
 * お知らせ情報削除
 *
 * @param {*} noticeId お知らせコード
 */
export async function deleteNotice(noticeId) {
  await apiClient.delete(`/notices/${noticeId}`);
}
