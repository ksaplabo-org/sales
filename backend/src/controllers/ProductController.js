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

      try {
        const product = await productService.findByCode(req.params.productCode);
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
  }

  /**
   * 商品情報登録
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async create(req, res) {
    try {
      const product = {
        productCode: req.body.productCode,
        productName: req.body.productName,
        orderKbn: req.body.orderKbn,
        orderClientCode: req.body.orderClientCode,
        productPrice: req.body.productPrice,
        createdId: req.body.createdId,
        updatedId: req.body.createdId,
      };

      // 共通バリデーション
      const errors = this.validate(product);

      //受発注区分
      if (!product.orderKbn) {
        errors.push({ field: "orderKbn", message: "受発注区分が設定されていません" });
      } else if (product.orderKbn != 1 && product.orderKbn != 2) {
        errors.push({ field: "orderKbn", message: "受発注区分は'1'か'2'を設定してください" });
      }

      //発注先コード
      if (product.orderKbn == 2) {
        if (!product.orderClientCode) {
          errors.push({ field: "orderClientCode", message: "発注先コードが設定されていません" });
        } else if (product.orderClientCode.length != 8) {
          errors.push({ field: "orderClientCode", message: "発注先コードは8桁で設定してください" });
        } else if (!/^[A-Za-z0-9]+$/.test(product.orderClientCode)) {
          errors.push({ field: "orderClientCode", message: "発注先コードは半角英数で設定してください" });
        }
      } else if (product.orderKbn == 1) {
        if (product.orderClientCode) {
          errors.push({ field: "orderClientCode", message: "発注先コードは設定できません" });
        }
      }

      // 登録者ID
      if (!product.createdId) {
        errors.push({ field: "createdId", message: "登録者IDが設定されていません" });
      } else if (product.createdId.length != 6) {
        errors.push({ field: "createdId", message: "登録者IDは6桁で設定してください" });
      } else if (!/^[A-Za-z0-9]+$/.test(product.createdId)) {
        errors.push({ field: "createdId", message: "登録者IDは半角英数で設定してください" });
      }

      if (errors.length > 0) {
        // パラメータエラー
        console.log(errors);
        res.status(400).json({ errors: errors });
      } else {
        // 登録処理実行
        await productService.create(product);
        res.status(201).send();
      }
    } catch (e) {
      console.log(e);

      if (e instanceof UniqueConstraintError) {
        res.status(UniqueConstraintError.status).send();
      } else if (e instanceof NotFoundEror) {
        res.status(NotFoundError.status).send();
      } else {
        res.status(500).send();
      }
    }
  }

  /**
   * 登録・更新共通バリデーション
   *
   * @param {*} data 登録データ
   * @returns エラー情報配列(空の場合はエラーなし)
   */
  validate(data) {
    const errors = [];

    // 商品コード
    if (!data.productCode) {
      errors.push({ field: "productCode", message: "商品コードが設定されていません" });
    } else if (data.productCode.length != 7) {
      errors.push({ field: "productCode", message: "商品コードは7桁で設定してください" });
    } else if (!/^[A-Za-z0-9]+$/.test(data.productCode)) {
      errors.push({ field: "productCode", message: "商品コードは半角英数で設定してください" });
    }

    // 商品名
    if (!data.productName) {
      errors.push({ field: "productName", message: "商品名が設定されていません" });
    } else if (data.productName.length > 20) {
      errors.push({ field: "productName", message: "商品名は20桁以内で設定してください" });
    }

    // 単価
    if (!data.productPrice) {
      errors.push({ field: "productPrice", message: "単価が設定されていません" });
    } else if (!/^[0-9]+$/.test(data.productPrice)) {
      errors.push({ field: "productPrice", message: "単価は半角数字で設定してください" });
    }

    return errors;
  }
}

export default new ProductController();
