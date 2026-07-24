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
   * 取引先情報詳細取得
   *
   * @param {*} id 取引先コード
   * @returns 取引先情報詳細
   */
  async findByCode(code) {
    const client = await clientRepository.findByCode(code);
    if (!client) {
      throw new NotFoundError();
    }
    return client;
  }

  /**
   * 取引先情報登録
   *
   * @param {*} clientInfo 取引先情報
   */
  async create(clientInfo) {
    // 一意性制約チェック
    const client = await clientRepository.findByCode(clientInfo.clientCode);
    if (client) {
      throw new UniqueConstraintError();
    }

    const now = new Date().toISOString();
    clientInfo.cretedAt = now;
    clientInfo.updatedAt = now;

    await clientRepository.create(clientInfo);
  }

  /**
   * 取引先情報更新
   *
   * @param {*} clientCode 取引先コード
   * @param {*} clientInfo 取引先情報
   */
  async update(clientCode, clientInfo) {
    // 更新データの存在チェック
    const client = await clientRepository.findByCode(clientCode);
    if (!client) {
      throw new NotFoundError();
    }
    const now = new Date().toISOString();
    clientInfo.updatedAt = now;

    await clientRepository.update(clientCode, clientInfo);
  }
}

export default new ClientService();
