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

    if (condition.startSearchDate || condition.endSearchDate) {
      where.searchDate = {};
      if (condition.startSearchDate) {
        where.searchDate[Op.gte] = condition.startSearchDate;
      }

      if (condition.endSearchDate) {
        where.searchDate[Op.lte] = condition.endSearchDate;
      }
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
