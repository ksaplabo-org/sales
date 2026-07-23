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
}

export default new ProductController();
