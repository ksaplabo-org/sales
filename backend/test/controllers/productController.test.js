import { expect, jest } from "@jest/globals";

import productController from "../../src/controllers/productController.js";
import productService from "../../src/services/productService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import ValidationError from "../../src/errors/ValidationError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";

// 全テストケース実行後に行う処理
afterEach(() => {
  // Mockをすべて初期化
  jest.clearAllMocks();
});

// 各テストで使用するレスポンス引数のMock
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
};

describe("productController", () => {
  describe("findAll 商品情報一覧取得", () => {
    test("[正常系] 検索条件がServiceに渡され、Serviceから結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        query: {
          productCode: "test01",
        },
      };

      // Mock設定
      const expectedResult = [
        {
          orderKbn: "1",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
        },
        {
          orderKbn: "1",
          productCode: "aa00002",
          productName: "塩",
          productPrice: 200,
        },
      ];
      const spy = jest.spyOn(productService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await productController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        orderKbn: undefined,
        productCode: "test01",
        productName: undefined,
        productPriceLow: undefined,
        productPriceHigh: undefined,
      });
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });
    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        query: {},
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindAll = jest.spyOn(productService, "findAll").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await productController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith({
        orderKbn: undefined,
        productCode: undefined,
        productName: undefined,
        productPriceLow: undefined,
        productPriceHigh: undefined,
      });
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("findByCode 商品情報詳細取得", () => {
    test("[正常系] Serviceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      // Mock設定
      const expectedResult = [
        {
          orderKbn: "1",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
        },
      ];
      const spy = jest.spyOn(productService, "findByCode").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await productController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      const expectedError = new Error();
      const spyFindByCode = jest.spyOn(productService, "findByCode").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await productController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("aa00001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
    test.each([
      {
        testName: "商品コードが未設定",
        productCode: undefined,
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードが設定されていません",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが半角英数でない",
        productCode: "aa0000あ",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.findByCode(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        params: {
          productCode,
        },
      };
      const exception = new NotFoundError();
      const spyFindByCode = jest.spyOn(productService, "findByCode").mockRejectedValue(exception);

      await productController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
  });
  describe("delete 商品情報削除", () => {
    test("[正常系] 商品コードがServiceに渡されること", async () => {
      // 検索条件
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      // Mock設定
      const spy = jest.spyOn(productService, "delete").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      const expectedError = new Error();
      const spyDelete = jest.spyOn(productService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await productController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("aa00001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    test.each([
      {
        testName: "商品コードが未設定",
        productCode: undefined,
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードが設定されていません",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが半角英数でない",
        productCode: "aa0000あ",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.delete(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        params: {
          productCode,
        },
      };
      const exception = new NotFoundError();
      const spyDelete = jest.spyOn(productService, "delete").mockRejectedValue(exception);

      await productController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith(productCode);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
    test("[異常系]ServiceでReferenceConstraintError発生時、ステータス[ReferenceConstraintError]でレスポンスされること", async () => {
      const productCode = "aaa0001";

      const req = {
        params: {
          productCode,
        },
      };

      const exception = new ReferenceConstraintError();

      const spyDlete = jest.spyOn(productService, "delete").mockRejectedValue(exception);

      await productController.delete(req, res);

      //Serviceの呼び出しを検証
      expect(spyDlete).toHaveBeenCalledTimes(1);
      expect(spyDlete).toHaveBeenCalledWith(productCode);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(ReferenceConstraintError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
  });

  describe("create 商品情報登録", () => {
    test.each([
      {
        testName: "受発注区分が'1'受注で発注先コードが未入力である",
        orderKbn: "1",
        orderClientCode: undefined,
      },
      {
        testName: "受発注区分が'2'発注で発注先コードが入力済みである",
        orderKbn: "2",
        orderClientCode: "aaaa0001",
      },
    ])("[正常系]$testName 場合、Serviceに商品情報が渡されること", async ({ orderKbn, orderClientCode }) => {
      // 登録データ
      const req = {
        body: {
          productCode: "aa00001",
          productName: "醤油",
          orderKbn: orderKbn,
          orderClientCode: orderClientCode,
          productPrice: 100,
          createdId: "test01",
          updatedId: "test01",
        },
      };

      // Mock設定
      const spy = jest.spyOn(productService, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productController.create(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        orderKbn: orderKbn,
        productCode: "aa00001",
        productName: "醤油",
        productPrice: 100,
        orderClientCode: orderClientCode,
        createdId: "test01",
        updatedId: "test01",
      });
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    //商品コードのバリデーション
    test.each([
      {
        testName: "商品コードが未設定",
        productCode: undefined,
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードが設定されていません",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが半角英数でない",
        productCode: "aa0000あ",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: productCode,
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aaaa0001",
          createdId: "test01",
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.create(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });

    //受発注区分のバリデーション
    test.each([
      {
        testName: "受発注区分が未設定",
        orderKbn: undefined,
        expectedLog: [
          {
            field: "orderKbn",
            message: "受発注区分が設定されていません",
          },
        ],
      },
      {
        testName: "受発注区分が1または2でもない",
        orderKbn: "3",
        expectedLog: [
          {
            field: "orderKbn",
            message: "受発注区分は'1'か'2'を設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ orderKbn, expectedLog }) => {
      const req = {
        body: {
          orderKbn: orderKbn,
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aaaa0001",
          createdId: "test01",
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.create(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    //発注先コードのバリデーション
    test.each([
      {
        testName: "発注先コードが未設定",
        orderClientCode: undefined,
        expectedLog: [
          {
            field: "orderClientCode",
            message: "発注先コードが設定されていません",
          },
        ],
      },
      {
        testName: "発注先コードが8桁でない",
        orderClientCode: "aaaa001",
        expectedLog: [
          {
            field: "orderClientCode",
            message: "発注先コードは8桁で設定してください",
          },
        ],
      },
      {
        testName: "発注先コードが半角英数でない",
        orderClientCode: "aaaa000あ",
        expectedLog: [
          {
            field: "orderClientCode",
            message: "発注先コードは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ orderClientCode, expectedLog }) => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: orderClientCode,
          createdId: "test01",
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.create(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    test("[異常系]受発注区分が'1'受注で、発注先コードが入力されていること", async () => {
      // 登録データ
      const req = {
        body: {
          productCode: "aa00001",
          productName: "醤油",
          orderKbn: "1",
          orderClientCode: "aaaa0001",
          productPrice: 100,
          createdId: "test01",
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      await productController.create(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderClientCode",
            message: "発注先コードは設定できません",
          },
        ],
      });
    });
    //登録者Idのバリデーション
    test.each([
      {
        testName: "登録者IDが未設定",
        createdId: undefined,
        expectedLog: [
          {
            field: "createdId",
            message: "登録者IDが設定されていません",
          },
        ],
      },
      {
        testName: "登録者IDが6桁でない",
        createdId: "test1",
        expectedLog: [
          {
            field: "createdId",
            message: "登録者IDは6桁で設定してください",
          },
        ],
      },
      {
        testName: "登録者IDが半角英数でない",
        createdId: "test1あ",
        expectedLog: [
          {
            field: "createdId",
            message: "登録者IDは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ createdId, expectedLog }) => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aaaa0001",
          createdId: createdId,
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.create(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });

    //  NotFoundErrorのテスト
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const orderClientCode = "aa000001";

      const req = {
        body: {
          orderKbn: "2",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: orderClientCode,
          createdId: "test01",
          updatedId: "test01",
        },
      };
      const exception = new NotFoundError();
      const spyCreate = jest.spyOn(productService, "create").mockRejectedValue(exception);

      await productController.create(req, res);

      // Serviceの呼び出しを検証
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith({
        orderKbn: "2",
        productCode: "aa00001",
        productName: "醤油",
        productPrice: 100,
        orderClientCode: orderClientCode,
        createdId: "test01",
        updatedId: "test01",
      });

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });

    //  UniqueConstraintErrorのテスト
    test("[異常系] ServiceでUniqueConstraintError発生時、ステータス[409]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        body: {
          orderKbn: "2",
          productCode: productCode,
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aa000001",
          createdId: "test01",
          updatedId: "test01",
        },
      };
      const exception = new UniqueConstraintError();
      const create = jest.spyOn(productService, "create").mockRejectedValue(exception);

      await productController.create(req, res);

      // Serviceの呼び出しを検証
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        orderKbn: "2",
        productCode: productCode,
        productName: "醤油",
        productPrice: 100,
        orderClientCode: "aa000001",
        createdId: "test01",
        updatedId: "test01",
      });

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UniqueConstraintError.status);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: "aaa0001",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aa000001",
          createdId: "test01",
          updatedId: "test01",
        },
      };
      const expectedError = new Error();
      const spyCreate = jest.spyOn(productService, "create").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await productController.create(req, res);

      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });

  describe("update 商品情報更新", () => {
    test("[正常系] Serviceに商品情報が渡されること", async () => {
      // 更新データ
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: 100,
          updatedId: "test01",
        },
      };

      // Mock設定
      const spy = jest.spyOn(productService, "update").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001", {
        productName: "醤油",
        orderClientCode: "aaaa0001",
        productPrice: 100,
        updatedId: "test01",
      });
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    //商品コードのバリデーション
    test.each([
      {
        testName: "商品コードが未設定",
        productCode: undefined,
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードが設定されていません",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが半角英数でない",
        productCode: "aa0000あ",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.update(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    //更新者Idのバリデーション
    test.each([
      {
        testName: "更新者IDが未設定",
        updatedId: undefined,
        expectedLog: [
          {
            field: "updatedId",
            message: "更新者IDが設定されていません",
          },
        ],
      },
      {
        testName: "更新者IDが6桁でない",
        updatedId: "test1",
        expectedLog: [
          {
            field: "updatedId",
            message: "更新者IDは6桁で設定してください",
          },
        ],
      },
      {
        testName: "更新者IDが半角英数でない",
        updatedId: "test1あ",
        expectedLog: [
          {
            field: "updatedId",
            message: "更新者IDは半角英数で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ updatedId, expectedLog }) => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: 100,
          updatedId: updatedId,
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.update(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    //  NotFoundErrorのテスト
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        params: {
          productCode: productCode,
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: 100,
          updatedId: "test01",
        },
      };
      const exception = new NotFoundError();
      const spyUpdate = jest.spyOn(productService, "update").mockRejectedValue(exception);

      await productController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(productCode, {
        productName: "醤油",
        orderClientCode: "aaaa0001",
        productPrice: 100,
        updatedId: "test01",
      });

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
    //受注なのに発注先コードがある場合のValidationErrorのテスト
    test("[異常系] ServiceでValidationError発生時、ステータス[400]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        params: {
          productCode: productCode,
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: 100,
          updatedId: "test01",
        },
      };

      const exception = new ValidationError("orderClientCode", "発注先コードは設定できません");

      productService.update.mockRejectedValue(exception);

      // テスト対象関数の呼び出し
      await productController.update(req, res);

      // Service呼び出し確認
      expect(productService.update).toHaveBeenCalledTimes(1);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);

      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: exception.field,
            message: exception.message,
          },
        ],
      });
    });
    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          orderKbn: "2",
          productName: "醤油",
          productPrice: 100,
          orderClientCode: "aa000001",
          createdId: "test01",
          updatedId: "test01",
        },
      };
      const expectedError = new Error();
      const spyCreate = jest.spyOn(productService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await productController.update(req, res);

      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });

  describe("validate 登録・更新共通バリデーション", () => {
    test("[正常系] バリデーションエラーがない場合、空配列が返却されること", () => {
      // 登録データ
      const product = {
        productName: "醤油",
        productPrice: 100,
      };

      // テスト対象関数の呼び出し
      const actual = productController.validate(product);

      // バリデーション結果の検証
      expect(actual).toEqual([]);
    });
    test.each([
      {
        testName: "商品名が未設定",
        productName: undefined,
        expectedLog: [
          {
            field: "productName",
            message: "商品名が設定されていません",
          },
        ],
      },
      {
        testName: "商品名が20桁以内で設定されていない",
        productName: "aaaaabbbbbcccccdddddeeeee",
        expectedLog: [
          {
            field: "productName",
            message: "商品名は20桁以内で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productName, expectedLog }) => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: productName,
          orderClientCode: "aaaa0001",
          productPrice: 100,
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.update(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
    test.each([
      {
        testName: "単価が未設定",
        productPrice: undefined,
        expectedLog: [
          {
            field: "productPrice",
            message: "単価が設定されていません",
          },
        ],
      },
      {
        testName: "単価が1以上で設定されていない",
        productPrice: -1,
        expectedLog: [
          {
            field: "productPrice",
            message: "単価は1以上で設定してください",
          },
        ],
      },
      {
        testName: "単価が半角数字で設定されていない",
        productPrice: "a",
        expectedLog: [
          {
            field: "productPrice",
            message: "単価は半角数字で設定してください",
          },
        ],
      },
    ])("[異常系] $testName 場合、ステータス[400]でレスポンスされること", async ({ productPrice, expectedLog }) => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: productPrice,
          updatedId: "test01",
        },
      };

      // テスト対象関数の呼び出し
      const actual = await productController.update(req, res);

      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });
  });
});
