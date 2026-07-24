import { col, fn, literal, Op } from "sequelize";
import ClientModel from "../models/ClientModel.js";

class ClientRepository {
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
