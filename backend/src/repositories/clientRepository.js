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
        "orderKbn",
        ["client_name", "clientName"],
        ["post_code", "postCode"],
        ["address1", "address1"],
        ["address2", "address2"],
        [fn("CONCAT", col("address1"), col("address2")), "fullAddress"],
        ["tel_number", "telNumber"],
        [literal("EXISTS(SELECT 1 FROM orders o WHERE o.client_code = ClientModel.client_code)"), "usedFlg"],
        // [literal('true'), "usedFlg"]
      ],
      where: where,
    });
  }

  /**
   * 取引先情報詳細取得
   *
   * @param {*} code 取引先コード
   * @returns 取引先情報
   */
  async findByCode(code) {
    return await ClientModel.findByPk(code);
  }

  /**
   * 取引先情報登録
   *
   * @param {*} clientInfo 取引先情報
   */
  async create(clientInfo) {
    await ClientModel.create(clientInfo);
  }

  /**
   * 取引先情報更新
   *
   * @param {*} clientCode 取引先コード
   * @param {*} clientInfo 取引先情報
   */
  async update(clientCode, clientInfo) {
    await ClientModel.update(clientInfo, {
      where: {
        clientCode: clientCode,
      },
    });
  }
}
export default new ClientRepository();
