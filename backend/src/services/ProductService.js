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

  /**
   * 商品情報詳細取得
   *
   * @param {*} productCode 商品コード
   * @returns 商品情報詳細
   */
  async findByCode(productCode) {
    const product = await productRepository.findByCode(productCode);
    if (!product) {
      throw new NotFoundError();
    }
    return product;
  }

  /**
   * 商品情報登録
   *
   * @param {*} productInfo 商品情報
   */
  async create(productInfo) {
    // 一意性制約チェック
    const product = await productRepository.findByCode(productInfo.productCode);
    if (product) {
      throw new UniqueConstraintError();
    }

    //発注先コード存在チェック
    // const productCode = await clientRepository.findByCode(productInfo.orderClientCode);
    // if (!productCode) {
    //   throw new NotFoundError();
    // }

    //現在日時を取得
    const now = new Date().toISOString();
    productInfo.createdAt = now;
    productInfo.updatedAt = now;

    await productRepository.create(productInfo);
  }
}

export default new ProductService();
