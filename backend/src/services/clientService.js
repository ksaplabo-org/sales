import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ClientRepository from "../repositories/clientRepository.js";
import OrderRepository from "../repositories/OrderRepository.js";

class ClientService {
  /**
   * 取引先情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 取引先情報一覧
   */
  async findAll(condition) {
    return await ClientRepository.findAll(condition);
  }

  /**
   * 取引先情報詳細取得
   *
   * @param {*} clientCode 取引先コード
   * @returns 取引先情報詳細
   */
  async findByCode(clientCode) {
    const client = await ClientRepository.findByCode(clientCode);
    if (!client) {
      throw new NotFoundError("clientCode", "この取引先情報は存在しません");
    }
    return client;
  }

  /**
   * 取引先情報物理削除
   *
   * @param {*} clientCode 取引先コード
   */
  async delete(clientCode) {
    //削除データの存在チェック
    const client = await ClientRepository.findByCode(clientCode);
    if (!client) {
      throw new NotFoundError("clientCode", "この取引先情報は存在しません");
    }
    // 削除データの外部参照チェック
    const clients = await OrderRepository.findAll({ clientCode: clientCode });
    if (clients) {
      throw new ReferenceConstraintError("clientCode", "取引先コードが受発注情報で使用されているため削除できません");
    }
    await ClientRepository.delete(clientCode);
  }
}

export default new ClientService();
