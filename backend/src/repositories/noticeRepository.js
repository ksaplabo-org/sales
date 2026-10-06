import { Op } from "sequelize";
import noticeModel from "../models/noticeModel.js";

class NoticeRepository {
  /**
   * お知らせ情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns お知らせ情報一覧
   */
  async findAll(condition) {
    // 検索条件を作成
    const where = {};
    if (condition.noticeId) {
      where.noticeId = { [Op.like]: "%" + condition.noticeId + "%" };
    }

    if (condition.startSearchDate) {
      where.endDate = { [Op.gte]: condition.startSearchDate };
    }
    if (condition.endSearchDate) {
      where.startDate = { [Op.lte]: condition.endSearchDate };
    }
    if (condition.targetType) {
      where.targetType = { [Op.eq]: condition.targetType };
    }
    // 検索結果を返却
    return await noticeModel.findAll({
      attributes: [
        ["notice_id", "noticeId"],
        ["title", "title"],
        ["start_date", "startDate"],
        ["end_date", "endDate"],
        ["target_type", "targetType"],
      ],
      where: where,
    });
  }

  /**
   * お知らせ情報詳細取得
   *
   * @param {*} noticeId お知らせID
   * @returns お知らせ情報
   */
  async findById(noticeId) {
    return await noticeModel.findByPk(noticeId);
  }

  /**
   * お知らせ情報登録
   *
   * @param {*} noticeInfo お知らせ情報
   */
  async create(noticeInfo) {
    await noticeModel.create(noticeInfo);
  }

  /**
   * お知らせ情報更新
   *
   * @param {*} noticeId お知らせID
   * @param {*} noticeInfo お知らせ情報
   */
  async update(noticeId, noticeInfo) {
    await noticeModel.update(noticeInfo, {
      where: {
        noticeId: noticeId,
      },
    });
  }

  /**
   * お知らせ情報物理削除
   *
   * @param {*} noticeId お知らせID
   */
  async delete(noticeId) {
    await noticeModel.destroy({
      where: {
        noticeId: noticeId,
      },
    });
  }
}

export default new NoticeRepository();
