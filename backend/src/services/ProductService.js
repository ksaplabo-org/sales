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
      throw new NotFoundError();
    }
    
    const orderKbn = product.orderKbn;
    
    const errors = [];
    
    //発注先コード
    if (product.orderKbn == "2") {
      if (!product.orderClientCode) {
        errors.push({ field: "orderClientCode", message: "発注先コードが設定されていません" });
      } else if (product.orderClientCode.length != 8) {
        errors.push({ field: "orderClientCode", message: "発注先コードは8桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(product.orderClientCode)) {
        errors.push({ field: "orderClientCode", message: "発注先コードは半角英数で設定してください" });
      }
    } else if (product.orderKbn == "1") {
      if (product.orderClientCode) {
        errors.push({ field: "orderClientCode", message: "発注先コードは設定できません" });
      }
    }
    
    if (errors.length > 0 ) {
      console.log(errors);
      console.log(product.orderKbn);
      const error = new Error();
      
      error.errors = errors;
      error.status = 400;
      
      throw error;
    }
    
    /*
    //発注先コードの存在チェック
    const orderClientCode = await clientRepository.findByCode(productInfo.orderClientCode);
    
    if (!orderClientCode) {
      throw new NotFoundError();
    }
    */
   
    //現在日時を取得
    const now = new Date().toISOString();;
    productInfo.updatedAt = now;
    
    await productRepository.update(productCode, productInfo);
  }
}

export default new ProductService();
