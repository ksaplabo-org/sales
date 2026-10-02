import NotFoundError from "../errors/NotFoundError.js";
import noticeRepository from "../repositories/noticeRepository.js";

class NoticeService {
  /**
   * お知らせ情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns お知らせ情報一覧
   */
  async findAll(condition) {
    if (condition.startSearchDate > condition.endSearchDate) {
      return [];
    }
    return await noticeRepository.findAll(condition);
  }

  /**
   * お知らせ情報削除
   *
   * @param {*} noticeId お知らせID
   */
  async delete(noticeId) {
    // 削除データの存在チェック
    const notice = await noticeRepository.findByCode(noticeId);
    if (!notice) {
      throw new NotFoundError("noticeId", "このお知らせIDは存在していません");
    }

    await noticeRepository.delete(noticeId);
  }
}

export default new NoticeService();
