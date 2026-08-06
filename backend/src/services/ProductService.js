import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
//import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
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

  /**
   * 商品情報詳細取得
   *
   * @param {*} productCode 商品コード
   * @returns 商品情報詳細
   */
  async findByCode(productCode) {
    const product = await productRepository.findByCode(productCode);
    if (!product) {
      //商品コードの存在チェック
      throw new NotFoundError("productCode", "この商品コードは存在していません");
    }
    return product;
  }

  /**
   * 商品情報削除
   *
   * @param {*} productCode 商品コード
   */
  async delete(productCode) {
    const product = await productRepository.findByCode(productCode);
    if (!product) {
      // 削除データの存在チェック
      throw new NotFoundError("productCode", "この商品コードは存在していません");
    }

    //削除データの外部参照チェック
    //orderRepositoryが存在しないため、コメントアウト
    /*
    const product = await orderRepository.findAll({ productCode : productCode })
    if(product) {
      throw new ReferenceConstraintError("productCode", "この商品コードは受発注情報で使用されているため削除できません");
    }
    */

    await productRepository.delete(productCode);
  }
}

export default new ProductService();