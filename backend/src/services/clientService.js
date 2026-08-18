import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
import clientRepository from "../repositories/clientRepository.js";
import orderRepository from "../repositories/orderRepository.js";

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
   * @param {*} clientCode 取引先コード
   * @returns 取引先情報詳細
   */
  async findByCode(clientCode) {
    const client = await clientRepository.findByCode(clientCode);
    if (!client) {
      throw new NotFoundError("clientCode", "この取引先情報は存在しません");
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
      throw new UniqueConstraintError("clientCode", "この取引先コードは既に使用されています");
    }

    const now = new Date().toISOString();
    clientInfo.createdAt = now;
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
      throw new NotFoundError("clientCode", "この取引先情報は存在しません");
    }
    
    const now = new Date().toISOString();
    clientInfo.updatedAt = now;

    await clientRepository.update(clientCode, clientInfo);
  }

  /**
   * 取引先情報物理削除
   *
   * @param {*} clientCode 取引先コード
   */
  async delete(clientCode) {
    //削除データの存在チェック
    const client = await clientRepository.findByCode(clientCode);
    if (!client) {
      throw new NotFoundError("clientCode", "この取引先情報は存在しません");
    }
    // 削除データの外部参照チェック
    const clients = await orderRepository.findAll({ clientCode: clientCode });
    if (clients) {
      throw new ReferenceConstraintError("clientCode", "取引先コードが受発注情報で使用されているため削除できません");
    }
    await clientRepository.delete(clientCode);
  }
}

export default new ClientService();
