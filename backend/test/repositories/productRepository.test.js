import { jest } from "@jest/globals";
import { literal, Op } from "sequelize";

import productModel from "../../src/models/productModel.js";
import productRepository from "../../src/repositories/productRepository.js";

describe("productRepository", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 商品情報一覧取得", () => {
    // 共通で使用するattributes属性の値
    const attributes = [
      ["product_code", "productCode"],
      ["product_name", "productName"],
      ["order_kbn", "orderKbn"],
      ["order_client_code", "orderClientCode"],
      ["product_price", "productPrice"],
      [literal("EXISTS(SELECT 1 FROM orders o WHERE o.product_code = productModel.product_code)"), "usedFlg"],
    ];

    // 共通で使用する検索結果
    const result = [{ productCode: "aa00001", productName: "りんご" }];

    test.each([
      {
        name: "条件なし",
        condition: {},
        where: {},
      },
      {
        name: "商品コードのみ",
        condition: { productCode: "aa00001" },
        where: {
          productCode: { [Op.eq]: "aa00001" },
        },
      },
      {
        name: "受発注区分のみ",
        condition: { orderKbn: "1" },
        where: {
          orderKbn: { [Op.eq]: "1" },
        },
      },
      {
        name: "商品名のみ",
        condition: { productName: "りんご" },
        where: {
          productName: { [Op.like]: "%りんご%" },
        },
      },
      {
        name: "下限金額のみ",
        condition: { productPriceLow: "200" },
        where: {
          productPrice: { [Op.gte]: "200" },
        },
      },
      {
        name: "上限金額のみ",
        condition: { productPriceHigh: "300" },
        where: {
          productPrice: { [Op.lte]: "300" },
        },
      },
      {
        name: "上限・下限金額のみ",
        condition: {
          productPriceHigh: "300",
          productPriceLow: "200",
        },
        where: {
          productPrice: {
            [Op.lte]: "300",
            [Op.gte]: "200",
          },
        },
      },
      {
        name: "すべての条件を指定",
        condition: {
          productCode: "aa00001",
          orderKbn: "1",
          productName: "りんご",
          productPriceLow: "200",
          productPriceHigh: "300",
        },
        where: {
          productCode: { [Op.eq]: "aa00001" },
          orderKbn: { [Op.eq]: "1" },
          productName: { [Op.like]: "%りんご%" },
          productPrice: {
            [Op.gte]: "200",
            [Op.lte]: "300",
          },
        },
      },
    ])("[正常系] 検索条件:$name", async ({ condition, where }) => {
      // Mock設定
      const spyFindAll = jest.spyOn(productModel, "findAll").mockResolvedValueOnce(result);

      // テスト対象関数の呼び出し
      const actual = await productRepository.findAll(condition);

      // 期待する引数
      const expectedArg = {
        attributes: attributes,
        where: where,
      };

      //検証
      expect(spyFindAll).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindAll).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(result); // 実行結果と期待結果が一致することを検証
    });
  });

  describe("findByCode 商品情報詳細取得", () => {
    test("[正常系] 商品情報詳細取得", async () => {
      // 共通で使用する商品情報
      const result = [{ productCode: "aa00001", productName: "りんご" }];

      // Mock設定
      const spyFindByCode = jest.spyOn(productModel, "findByPk").mockResolvedValueOnce(result);

      // 商品コード
      const productCode = "aa00001";

      // テスト対象関数の呼び出し
      const actual = await productRepository.findByCode(productCode);

      // 期待する引数
      const expectedArg = "aa00001";

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(result); // 実行結果と期待結果が一致することを検証
    });
  });

  describe("create 商品情報登録", () => {
    test("[正常系] 商品情報登録", async () => {
      // 商品情報
      const productInfo = { productCode: "aa00001", productName: "りんご" };

      // Mock設定
      const spyCreate = jest.spyOn(productModel, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productRepository.create(productInfo);

      //期待する引数
      const expectedArg = productInfo;

      // 検証
      expect(spyCreate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyCreate).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("update 商品情報更新", () => {
    test("[正常系] 商品情報更新", async () => {
      // 共通で使用する商品情報
      const productInfo = { productCode: "aa00001", productName: "りんご" };

      // Mock設定
      const spyUpdate = jest.spyOn(productModel, "update").mockResolvedValueOnce();

      // 商品コード
      const productCode = "aa00001";

      // テスト対象関数の呼び出し
      await productRepository.update(productCode, productInfo);

      // 期待する引数
      const expectedArg = [
        productInfo,
        {
          where: {
            productCode: "aa00001",
          },
        },
      ];

      //検証
      expect(spyUpdate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyUpdate).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("delete 商品情報物理削除", () => {
    test("[正常系] 商品情報削除", async () => {
      // Mock設定
      const spyDelete = jest.spyOn(productModel, "destroy").mockResolvedValueOnce();

      // 商品コード
      const productCode = "aa00001";

      // テスト対象関数の呼び出し
      await productRepository.delete(productCode);

      // 期待する引数
      const expectedArg = {
        where: {
          productCode: "aa00001",
        },
      };

      //検証
      expect(spyDelete).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
    });
  });
});
