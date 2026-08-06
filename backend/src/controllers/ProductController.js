import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
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
        productName: req.query.productName,
        productPriceLow: req.query.productPriceLow,
        productPriceHigh: req.query.productPriceHigh,
      };

      // 商品情報一覧検索
      const products = await productService.findAll(condition);
      return res.json(products);
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  }

  /**
   * 商品情報詳細取得
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async findByCode(req, res) {
    try {
      const errors = [];

      if (!req.params.productCode) {
        errors.push({
          field: "productCode",
          message: "商品コードが設定されていません",
        });
      } else if (req.params.productCode.length != 7) {
        errors.push({
          field: "productCode",
          message: "商品コードは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.productCode)) {
        errors.push({
          field: "productCode",
          message: "商品コードは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        return res.status(400).json({ errors: errors });
      }

      // 商品情報詳細取得
      const product = await productService.findByCode(req.params.productCode);
      return res.json(product);
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        //存在チェックエラー
        return res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
      } else {
        return res.status(500).send();
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
      const errors = [];

      if (!req.params.productCode) {
        errors.push({
          field: "productCode",
          message: "商品コードが設定されていません",
        });
      } else if (req.params.productCode.length != 7) {
        errors.push({
          field: "productCode",
          message: "商品コードは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(req.params.productCode)) {
        errors.push({
          field: "productCode",
          message: "商品コードは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        return res.status(400).json({ errors: errors });
      }

      // 商品情報削除
      await productService.delete(req.params.productCode);
      return res.send();
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        //存在チェックエラー
        return res.status(NotFoundError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
      } else if (e instanceof ReferenceConstraintError) {
        //外部参照エラー
        return res.status(ReferenceConstraintError.status).json({
          errors: [
            {
              field: e.field,
              message: e.message,
            },
          ],
        });
      } else {
        return res.status(500).send();
      }
    }
  }
}

export default new ProductController();
