import UniqueConstraintError from "../errors/UniqueConstraintError.js";
import NotFoundError from "../errors/NotFoundError.js";
import ReferenceConstraintError from "../errors/ReferenceConstraintError.js";
import productService from "../services/productService.js";
import ValidationError from "../errors/ValidationError.js";

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
      //商品情報詳細取得
      const product = await productService.findByCode(req.params.productCode);
      return res.json(product);
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        // 存在チェックエラー
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

      // 商品コード
      if (!product.productCode) {
        errors.push({
          field: "productCode",
          message: "商品コードが設定されていません",
        });
      } else if (product.productCode.length != 7) {
        errors.push({
          field: "productCode",
          message: "商品コードは7桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(product.productCode)) {
        errors.push({
          field: "productCode",
          message: "商品コードは半角英数で設定してください",
        });
      }

      //受発注区分
      if (!product.orderKbn) {
        errors.push({
          field: "orderKbn",
          message: "受発注区分が設定されていません",
        });
      } else if (product.orderKbn != 1 && product.orderKbn != 2) {
        errors.push({
          field: "orderKbn",
          message: "受発注区分は'1'か'2'を設定してください",
        });
      }

      //発注先コード
      //受発注区分が発注の場合
      if (product.orderKbn == 2) {
        if (!product.orderClientCode) {
          errors.push({
            field: "orderClientCode",
            message: "発注先コードが設定されていません",
          });
        } else if (product.orderClientCode.length != 8) {
          errors.push({
            field: "orderClientCode",
            message: "発注先コードは8桁で設定してください",
          });
        } else if (!/^[A-Za-z0-9]+$/.test(product.orderClientCode)) {
          errors.push({
            field: "orderClientCode",
            message: "発注先コードは半角英数で設定してください",
          });
        }
      }
      //受発注区分が受注の場合
      else if (product.orderKbn == 1) {
        if (product.orderClientCode) {
          errors.push({
            field: "orderClientCode",
            message: "発注先コードは設定できません",
          });
        }
      }

      // 登録者ID
      if (!product.createdId) {
        errors.push({
          field: "createdId",
          message: "登録者IDが設定されていません",
        });
      } else if (product.createdId.length != 6) {
        errors.push({
          field: "createdId",
          message: "登録者IDは6桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(product.createdId)) {
        errors.push({
          field: "createdId",
          message: "登録者IDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        return res.status(400).json({ errors: errors });
      } else {
        // 登録処理
        await productService.create(product);
        return res.status(201).send();
      }
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
      } else if (e instanceof UniqueConstraintError) {
        //一意制約エラー
        return res.status(UniqueConstraintError.status).json({
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
   * 商品情報更新
   *
   * @param {*} req リクエスト情報
   * @param {*} res レスポンス情報
   */
  async update(req, res) {
    try {
      let errors = [];

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

      const product = {
        productName: req.body.productName,
        orderClientCode: req.body.orderClientCode,
        productPrice: req.body.productPrice,
        updatedId: req.body.updatedId,
      };

      // 共通バリデーション
      errors = this.validate(product);

      // 更新者ID
      if (!product.updatedId) {
        errors.push({
          field: "updatedId",
          message: "更新者IDが設定されていません",
        });
      } else if (product.updatedId.length != 6) {
        errors.push({
          field: "updatedId",
          message: "更新者IDは6桁で設定してください",
        });
      } else if (!/^[A-Za-z0-9]+$/.test(product.updatedId)) {
        errors.push({
          field: "updatedId",
          message: "更新者IDは半角英数で設定してください",
        });
      }

      if (errors.length > 0) {
        // パラメータエラー
        return res.status(400).json({ errors: errors });
      } else {
        //更新処理
        await productService.update(req.params.productCode, product);
        return res.send();
      }
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
      } else if (e instanceof ValidationError) {
        //パラメータエラー
        return res.status(ValidationError.status).json({
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

  /**
   * 登録・更新共通バリデーション
   *
   * @param {*} data 登録データ
   * @returns エラー情報配列(空の場合はエラーなし)
   */
  validate(data) {
    const errors = [];

    // 商品名
    if (!data.productName) {
      errors.push({
        field: "productName",
        message: "商品名が設定されていません",
      });
    } else if (data.productName.length > 20) {
      errors.push({
        field: "productName",
        message: "商品名は20桁以内で設定してください",
      });
    }

    // 単価
    if (!data.productPrice) {
      errors.push({
        field: "productPrice",
        message: "単価が設定されていません",
      });
    } else if (data.productPrice <= 0) {
      errors.push({
        field: "productPrice",
        message: "単価は1以上で設定してください",
      });
    } else if (!/^[0-9]+$/.test(data.productPrice)) {
      errors.push({
        field: "productPrice",
        message: "単価は半角数字で設定してください",
      });
    }

    return errors;
  }
}

export default new ProductController();
