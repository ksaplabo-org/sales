import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import productRepository from "../repositories/ProductRepository.js";

class ProductService {
  /**
   * 商品情報一覧取得
   *
   * @param {*} condition 検索条件
   * @returns 商品情報一覧
   */
  async findAll(condition) {
    return await productRepository.findAll(condition);
  }
}

export default new ProductService();
