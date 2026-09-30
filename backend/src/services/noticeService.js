import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import noticeRepository from "../repositories/noticeRepository.js";
import ValidationError from "../errors/ValidationError.js";

class NoticeService {
  /**
   * お知らせ情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns お知らせ情報一覧
   */
  async findAll(condition) {
    return await noticeRepository.findAll(condition);
  }

  /**
   * お知らせ情報詳細取得
   *
   * @param {*} noticeId お知らせID
   * @returns お知らせ情報詳細
   */
  async findById(noticeId) {
    const notice = await noticeRepository.findById(noticeId);
    if (!notice) {
      //お知らせIDの存在チェック
      throw new NotFoundError("noticeId", "このお知らせIDは存在していません");
    }
    return notice;
  }

  /**
   * お知らせ情報登録
   *
   * @param {*} noticeInfo お知らせ情報
   */
  async create(noticeInfo) {
    // 一意性制約チェック
    const notice = await noticeRepository.findById(noticeInfo.noticeId);
    if (notice) {
      throw new UniqueConstraintError("noticeId", "このお知らせIDは既に登録されているため登録できません");
    }

    //現在日時を取得
    const now = new Date().toISOString();

    //掲載開始日バリデーションチェック
    if (noticeInfo.startDate < now) {
      throw new ValidationError("startDate", "掲載開始日をシステム日時以降に設定してください");
    }

    //登録情報に現在日時を設定
    noticeInfo.createdAt = now;
    noticeInfo.updatedAt = now;

    await noticeRepository.create(noticeInfo);
  }

  /**
   * お知らせ情報更新
   *
   * @param {*} noticeId お知らせID
   * @param {*} noticeInfo お知らせ情報
   */
  async update(noticeId, noticeInfo) {
    // 更新データの存在チェック
    const notice = await noticeRepository.findById(noticeId);
    if (!notice) {
      throw new NotFoundError("noticeId", "このお知らせIDは存在していません");
    }

    //現在日時を取得
    const now = new Date().toISOString();

    //掲載開始日バリデーションチェック
    if (noticeInfo.startDate != notice.startDate && noticeInfo.startDate < now) {
      throw new ValidationError("startDate", "掲載開始日を登録済みの日付またはシステム日時以降に設定してください");
    }

    noticeInfo.updatedAt = now;

    await noticeRepository.update(noticeId, noticeInfo);
  }

  /**
   * お知らせ情報削除
   *
   * @param {*} noticeId お知らせID
   */
  async delete(noticeId) {
    // 削除データの存在チェック
    const notice = await noticeRepository.findById(noticeId);
    if (!notice) {
      throw new NotFoundError("noticeId", "このお知らせIDは存在していません");
    }

    await noticeRepository.delete(noticeId);
  }
}

export default new NoticeService();
