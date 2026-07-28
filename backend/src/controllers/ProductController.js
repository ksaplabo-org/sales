import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import productService from "../services/ProductService.js";

class ProductController {
  /**
   * 商品情報一覧取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findAll(req, res) {
    try {
      // クエリパラメータから検索条件を作成
      const condition = {
        orderKbn: req.query.orderKbn,
        productCode: req.query.productCode,
        productName: req.query.ProductName,
        productPriceLow: req.query.productPriceLow,
        productPriceHigh: req.query.productPriceHigh,
      };

      // 商品情報一覧検索
      const products = await productService.findAll(condition);
      res.json(products);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  /**
   * 商品情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
    //console.log(req.params.productCode);
    
    const errors = [];

    if (!req.params.productCode) {
      errors.push({ field: "productCode", message: "商品コードが設定されていません" });
    } else if (req.params.productCode.length != 7) {
      errors.push({ field: "productCode", message: "商品コードは7桁で設定してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(req.params.productCode)) {
      errors.push({ field: "productCode", message: "商品コードは半角英数で設定してください" });
    }

    if (errors.length > 0) {
      // パラメータエラー
      console.error(errors);
      res.status(400).json({ errors: errors });
    }
    

    try {
      const product = await productService.findByCode(req.params.productCode);
      console.log(product.productName);
      res.json(product);
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundError) {
        // 存在チェックエラー
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 商品情報削除
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async delete(req, res) {
    try {
      await productService.delete(req.params.productCode);
      res.send();
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundError) {
        res.status(NotFoundError.status).send();
      } else if (e instanceof ReferenceConstraintError) {
        res.status(ReferenceConstraintError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }
}

export default new ProductController();
