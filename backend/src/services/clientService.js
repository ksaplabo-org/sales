import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import clientRepository from "../repositories/ClientRepository.js";
//import orderRepository from "../repositories/OrderRepository.js";

class ClientService {
  /**
   * 取引先情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 取引先情報一覧
   */
  async findAll(condition) {
    return await clientRepository.findAll(condition);
  }

  /**
   * 取引先情報物理削除
   *
   * @param {*} clientCode 取引先コード
   */
  async delete(clientCode) {
    // 削除データの存在チェック
    const client = await clientRepository.findByCode(clientCode);
    //const used = await orderRepository.findByAll(clientCode);
    if (!client) {
      throw new NotFoundError();
    }
    // 削除データの外部参照チェック
    //if (used) {
    //throw new UniqueConstraintError();
    //}
    await clientRepository.delete(clientCode);
  }
}

export default new ClientService();
