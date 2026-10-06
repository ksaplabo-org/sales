import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import noticeRepository from "../repositories/noticeRepository.js";
import MultipleValidationError from "../errors/MultipleValidationError.js";

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
    const now = new Date().toISOString().split("T")[0];

    //日付バリデーション
    //空のエラー情報配列
    const errors = [];

    //掲載開始日バリデーションチェック
    if (noticeInfo.startDate < now) {
      errors.push({
        field: "startDate",
        message: "掲載開始日をシステム日付以降に設定してください",
      });
    }

    //掲載終了日バリデーションチェック
    if (noticeInfo.endDate < noticeInfo.startDate) {
      errors.push({
        field: "endDate",
        message: "掲載終了日を掲載開始日以降に設定してください",
      });
    }

    //エラー情報配列要素が存在する場合
    if (errors.length > 0) {
      throw new MultipleValidationError(errors);
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
    const now = new Date().toISOString().split("T")[0];

    //日付バリデーション
    //空のエラー情報配列
    const errors = [];

    //掲載開始日バリデーションチェック
    if (noticeInfo.startDate != notice.startDate && noticeInfo.startDate < now) {
      errors.push({
        field: "startDate",
        message: "掲載開始日を登録済みの日付またはシステム日付以降に設定してください",
      });
    }

    //掲載終了日バリデーションチェック
    if (noticeInfo.endDate < noticeInfo.startDate) {
      errors.push({
        field: "endDate",
        message: "掲載終了日を掲載開始日以降に設定してください",
      });
    }

    //エラー情報配列要素が存在する場合
    if (errors.length > 0) {
      throw new MultipleValidationError(errors);
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
