import NotFoundError from "../errors/NotFoundError.js";
import noticeService from "../services/noticeService.js";

class NoticeController {
  /**
   * お知らせ情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findAll(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        noticeId: req.query.noticeId,
        startSearchDate: req.query.startSearchDate,
        endSearchDate: req.query.endSearchDate,
        targetType: req.query.targetType,
      };

      // お知らせ情報一覧検索
      const notices = await noticeService.findAll(condition);
      res.json(notices);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }

  /**
   * お知らせ情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      const errors = [];

      if (!req.params.noticeId) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDが設定されていません",
        });
      } else if (req.params.noticeId.length != 7) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.noticeId)) {
        errors.push({
          field: "noticeId",
          message: "お知らせIDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        res.status(400).json({ errors: errors });
        return;
      }

      // 商品情報削除
      await noticeService.delete(req.params.noticeId);
      res.send();
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        //存在チェックエラー
        res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
        return;
      } else {
        res.status(500).send();
      }
    }
  }
}

export default new NoticeController();
