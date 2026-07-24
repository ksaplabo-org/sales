import { col, fn, literal, Op } from "sequelize";
import ClientModel from "../models/ClientModel.js";

class ClientRepository {
  /**
   * 取引先情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 取引先情報一覧
   */
  async findAll(condition) {
    // 検索条件を作成
    const where = {};
    if (condition.clientCode) {
      where.clientCode = { [Op.like]: "%" + condition.clientCode + "%" };
    }
    if (condition.clientName) {
      where.clientName = { [Op.like]: "%" + condition.clientName + "%" };
    }
    if (condition.orderKbn) {
      where.orderKbn = condition.orderKbn;
    }

    // 検索結果を返却
    return await ClientModel.findAll({
      attributes: [
        ["client_code", "clientCode"],
        ["order_kbn", "orderKbn"],
        ["client_name", "clientName"],
        ["post_code", "postCode"],
        ["address1", "address1"],
        ["address2", "address2"],
        [fn("CONCAT", col("address1"), col("address2")), "fullAddress"],
        ["tel_number", "telNumber"],
        [literal("EXISTS(SELECT 1 FROM orders o WHERE o.client_code = ClientModel.client_code)"), "usedFlg"],
      ],
      where: where,
    });
  }
  /**
   * 取引先情報物理削除
   *
   * @param {*} clientCode 取引先コード
   * 
   */
  async delete(clientCode) {
    await ClientModel.destroy({
      where: {
        client_code: clientCode,
      },
    });
  }  
}
export default new ClientRepository();
