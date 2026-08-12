import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
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
      //存在チェック
      throw new NotFoundError("productCode", "この商品コードは存在していません");
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
      throw new UniqueConstraintError("productCode", "この商品コードは既に登録されているため登録できません");
    }

    //発注先コード存在チェック
    // const productCode = await clientRepository.findByCode(productInfo.orderClientCode);
    // if (!productCode) {
    //   throw new NotFoundError("clientCode", "この発注先コードは存在していません");
    // }

    //現在日時を取得
    const now = new Date().toISOString();
    productInfo.createdAt = now;
    productInfo.updatedAt = now;

    await productRepository.create(productInfo);
  }

  /**
   * 商品情報更新
   *
   * @param {*} productCode 商品コード
   * @param {*} productInfo 商品情報
   */
  async update(productCode, productInfo) {
    // 更新データの存在チェック
    const product = await productRepository.findByCode(productCode);
    if (!product) {
      throw new NotFoundError("productCode", "この商品コードは存在していません");
    }

    //パラメータチェック
    const errors = [];
    //発注先コード
    if (product.orderKbn == "2") {
      if (!productInfo.orderClientCode) {
        errors.push({ field: "orderClientCode", message: "発注先コードが設定されていません" });
      } else if (productInfo.orderClientCode.length != 8) {
        errors.push({ field: "orderClientCode", message: "発注先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(productInfo.orderClientCode)) {
        errors.push({ field: "orderClientCode", message: "発注先コードは半角英数で設定してください" });
      }
    } else if (product.orderKbn == "1") {
      if (productInfo.orderClientCode) {
        errors.push({ field: "orderClientCode", message: "発注先コードは設定できません" });
      }
    }

    if (errors.length > 0) {
      const error = new ValidationError();
      error.errors = errors;
      throw error;
    }

    /*
    //発注先コードの存在チェック
    const orderClientCode = await clientRepository.findByCode(productInfo.orderClientCode);
    if (!orderClientCode) {
      throw new NotFoundError("clientCode", "この発注先コードは存在していません");
    }
    */

    //現在日時を取得
    const now = new Date().toISOString();
    productInfo.updatedAt = now;

    await productRepository.update(productCode, productInfo);
  }
}

export default new ProductService();
