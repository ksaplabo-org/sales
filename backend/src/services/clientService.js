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
}

export default new ClientService();
