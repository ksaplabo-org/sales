import { beforeEach, expect, jest } from "@jest/globals";

import productController from "../../src/controllers/productController.js";
import productService from "../../src/services/productService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import ValidationError from "../../src/errors/ValidationError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";

let res;

//全テストケース実行前に行う処理
beforeEach(() => {
  //Mockをすべて初期化
  jest.resetAllMocks();

  //各テストで使用するレスポンス引数のMock

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
});

describe("productController", () => {
  describe("findAll 商品情報一覧取得", () => {
    test("[正常系] 検索条件がServiceに渡され、Serviceから結果がレスポンスされること", async () => {
      //検索条件
      const req = {
        query: {
          orderKbn: "1",
          productCode: "aa00001",
          productName: "醤油",
          productPriceLow: "100",
          productPriceHigh: "1000",
        },
      };

      //Mock設定
      const expectedResult = [
        {
          orderKbn: "1",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: "100",
        },
      ];
      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "findAll").mockResolvedValueOnce(expectedResult);

      //テスト対象関数の呼び出し
      await productController.findAll(req, res);

      //Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        orderKbn: "1",
        productCode: "aa00001",
        productName: "醤油",
        productPriceLow: "100",
        productPriceHigh: "1000",
      });
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); //呼び出しされないことでデフォルト値である200が設定されていることを検証
      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        query: {},
      };

      //serviceエラーモック
      const expectedError = new Error();
      const spyFindAll = jest.spyOn(productService, "findAll").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.findAll(req, res);

      //Serviceの呼び出しを検証
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith({
        orderKbn: undefined,
        productCode: undefined,
        productName: undefined,
        productPriceLow: undefined,
        productPriceHigh: undefined,
      });
      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("findByCode 商品情報詳細取得", () => {
    test("[正常系] Serviceの結果がレスポンスされること", async () => {
      //検索条件
      const req = {
        params: {
          productCode: "aa00001",
        },
      };

      //Mock設定
      const expectedResult = [
        {
          orderKbn: "1",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: "100",
        },
      ];
      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "findByCode").mockResolvedValueOnce(expectedResult);

      //テスト対象関数の呼び出し
      await productController.findByCode(req, res);

      //Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001");
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0);
      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      //serviceエラーモック
      const expectedError = new Error();
      const spyFindByCode = jest.spyOn(productService, "findByCode").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.findByCode(req, res);

      //Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("aa00001");
      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      //レスポンス送信の検証
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
        testName: "商品コードが7桁(6桁入力)でない",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが7桁(8桁入力)でない",
        productCode: "aa000012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };
      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "findByCode").mockResolvedValue(undefined);

      //テスト対象関数の呼び出し
      await productController.findByCode(req, res);

      //Serviceが呼ばれていないことを検証
      expect(spy).not.toHaveBeenCalled();
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
      //serviceエラーモック
      const exceptedError = new NotFoundError("productCode", "この商品コードは存在していません");
      const spyFindByCode = jest.spyOn(productService, "findByCode").mockRejectedValue(exceptedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.findByCode(req, res);

      //Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(exceptedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "productCode",
            message: "この商品コードは存在していません",
          },
        ],
      });
    });
  });

  describe("delete 商品情報削除", () => {
    test("[正常系] 商品コードがServiceに渡され、Serviceから結果がレスポンスされること", async () => {
      //検索条件
      const req = {
        params: {
          productCode: "aa00001",
        },
      };

      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "delete").mockResolvedValueOnce();

      //テスト対象関数の呼び出し
      await productController.delete(req, res);

      //Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001");
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0);
      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
      };
      //serviceエラーモック
      const expectedError = new Error();
      const spyDelete = jest.spyOn(productService, "delete").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.delete(req, res);

      //Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("aa00001");
      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      //レスポンス送信の検証
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
        testName: "商品コードが7桁でない(6桁入力である)",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない(8桁入力である)",
        productCode: "aa000012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };
      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "delete");

      //テスト対象関数の呼び出し
      await productController.delete(req, res);

      //Serviceが呼び出されていないことを検証
      expect(spy).not.toHaveBeenCalled();
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
      //serviceエラーモック
      const exceptedError = new NotFoundError(productCode, "この商品コードは存在していません");
      const spyDelete = jest.spyOn(productService, "delete").mockRejectedValue(exceptedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.delete(req, res);

      //Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith(productCode);

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(exceptedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: productCode,
            message: "この商品コードは存在していません",
          },
        ],
      });
    });

    test("[異常系]ServiceでReferenceConstraintError発生時、ステータス[409]でレスポンスされること", async () => {
      const productCode = "aaa0001";

      const req = {
        params: {
          productCode,
        },
      };

      //serviceエラーモック
      const exceptedError = new ReferenceConstraintError(
        productCode,
        "この商品コードは受発注情報で使用されているため削除できません",
      );
      const spyDelete = jest.spyOn(productService, "delete").mockRejectedValue(exceptedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.delete(req, res);

      //Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith(productCode);

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(exceptedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(ReferenceConstraintError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: productCode,
            message: "この商品コードは受発注情報で使用されているため削除できません",
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
    ])("[正常系]$testName場合、Serviceに商品情報が渡されること", async ({ orderKbn, orderClientCode }) => {
      //登録データ
      const req = {
        body: {
          productCode: "aa00001",
          productName: "醤油",
          orderKbn: orderKbn,
          orderClientCode: orderClientCode,
          productPrice: "100",
          createdId: "test01",
        },
      };

      //serviceの戻り値をモック
      const spyCreate = jest.spyOn(productService, "create").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.create(req, res);

      //Serviceの呼び出しを検証
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith({
        orderKbn: orderKbn,
        productCode: "aa00001",
        productName: "醤油",
        productPrice: "100",
        orderClientCode: orderClientCode,
        createdId: "test01",
        updatedId: "test01",
      });
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
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
        testName: "商品コードが7桁でない(6桁入力である)",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない(8桁入力である)",
        productCode: "aa000012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: productCode,
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aaaa0001",
          createdId: "test01",
        },
      };

      //テスト対象関数の呼び出し
      await productController.create(req, res);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
        testName: "受発注区分が有効値(1,2)以外である",
        orderKbn: "3",
        expectedLog: [
          {
            field: "orderKbn",
            message: "受発注区分は'1'か'2'を設定してください",
          },
        ],
      },
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ orderKbn, expectedLog }) => {
      const req = {
        body: {
          orderKbn: orderKbn,
          productCode: "aa00001",
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aaaa0001",
          createdId: "test01",
        },
      };

      //テスト対象関数の呼び出し
      await productController.create(req, res);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
        testName: "発注先コードが8桁でない(7桁入力である)",
        orderClientCode: "aaaa001",
        expectedLog: [
          {
            field: "orderClientCode",
            message: "発注先コードは8桁で設定してください",
          },
        ],
      },
      {
        testName: "発注先コードが8桁でない(9桁入力である)",
        orderClientCode: "aaaa00012",
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
    ])(
      "[異常系]受発注区分が'2'発注で$testName場合、ステータス[400]でレスポンスされること",
      async ({ orderClientCode, expectedLog }) => {
        const req = {
          body: {
            orderKbn: "2",
            productCode: "aa00001",
            productName: "醤油",
            productPrice: "100",
            orderClientCode: orderClientCode,
            createdId: "test01",
          },
        };

        //テスト対象関数の呼び出し
        await productController.create(req, res);
        //レスポンスステータス設定の検証
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        //レスポンス送信の検証
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
      },
    );

    test("[異常系]受発注区分が'1'受注で発注先コードが入力されている場合、ステータス[400]でレスポンスされること", async () => {
      //登録データ
      const req = {
        body: {
          productCode: "aa00001",
          productName: "醤油",
          orderKbn: "1",
          orderClientCode: "aaaa0001",
          productPrice: "100",
          createdId: "test01",
        },
      };

      //テスト対象関数の呼び出し
      await productController.create(req, res);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
        testName: "登録者IDが6桁でない(5桁入力である)",
        createdId: "test1",
        expectedLog: [
          {
            field: "createdId",
            message: "登録者IDは6桁で設定してください",
          },
        ],
      },
      {
        testName: "登録者IDが6桁でない(7桁入力である)",
        createdId: "test012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ createdId, expectedLog }) => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aaaa0001",
          createdId: createdId,
        },
      };

      //テスト対象関数の呼び出し
      await productController.create(req, res);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });

    // NotFoundErrorのテスト
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const req = {
        body: {
          orderKbn: "2",
          productCode: "aa00001",
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aa000001",
          createdId: "test01",
        },
      };
      //serviceエラーモック
      const exceptedError = new NotFoundError("aa000001", "この発注先コードは存在していません");
      const spyCreate = jest.spyOn(productService, "create").mockRejectedValue(exceptedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.create(req, res);

      //Serviceの呼び出しを検証
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith({
        orderKbn: "2",
        productCode: "aa00001",
        productName: "醤油",
        productPrice: "100",
        orderClientCode: "aa000001",
        createdId: "test01",
        updatedId: "test01",
      });

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(exceptedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "aa000001",
            message: "この発注先コードは存在していません",
          },
        ],
      });
    });

    // UniqueConstraintErrorのテスト
    test("[異常系] ServiceでUniqueConstraintError発生時、ステータス[409]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        body: {
          orderKbn: "2",
          productCode: productCode,
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aa000001",
          createdId: "test01",
        },
      };

      //serviceエラーモック
      const exceptedError = new UniqueConstraintError(
        productCode,
        "この商品コードは既に登録されているため登録できません",
      );
      //serviceエラーモック
      const spyCreate = jest.spyOn(productService, "create").mockRejectedValue(exceptedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.create(req, res);

      //Serviceの呼び出しを検証
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith({
        orderKbn: "2",
        productCode: productCode,
        productName: "醤油",
        productPrice: "100",
        orderClientCode: "aa000001",
        createdId: "test01",
        updatedId: "test01",
      });

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(exceptedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UniqueConstraintError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: productCode,
            message: "この商品コードは既に登録されているため登録できません",
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
          productPrice: "100",
          orderClientCode: "aa000001",
          createdId: "test01",
        },
      };

      //serviceエラーモック
      const expectedError = new Error();
      const spyCreate = jest.spyOn(productService, "create").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.create(req, res);

      //serviceの呼び出し検証
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith({
        orderKbn: "2",
        productCode: "aaa0001",
        productName: "醤油",
        productPrice: "100",
        orderClientCode: "aa000001",
        createdId: "test01",
        updatedId: "test01",
      });

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("update 商品情報更新", () => {
    test("[正常系] Serviceに商品情報が渡されること", async () => {
      //更新データ
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: "100",
          updatedId: "test01",
        },
      };

      //serviceの戻り値をモック
      const spy = jest.spyOn(productService, "update").mockResolvedValueOnce();

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("aa00001", {
        productName: "醤油",
        orderClientCode: "aaaa0001",
        productPrice: "100",
        updatedId: "test01",
      });
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0);
      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
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
        testName: "商品コードが7桁でない(6桁入力である)",
        productCode: "aa0001",
        expectedLog: [
          {
            field: "productCode",
            message: "商品コードは7桁で設定してください",
          },
        ],
      },
      {
        testName: "商品コードが7桁でない(8桁入力である)",
        productCode: "aa000012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ productCode, expectedLog }) => {
      const req = {
        params: {
          productCode: productCode,
        },
      };
      //serviceの戻り値をモック
      const spyUpdate = jest.spyOn(productService, "update");

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //商品情報更新取得処理が呼ばれていないことを検証
      expect(spyUpdate).not.toHaveBeenCalled();
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
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
        testName: "更新者IDが6桁でない(5桁入力である)",
        updatedId: "test1",
        expectedLog: [
          {
            field: "updatedId",
            message: "更新者IDは6桁で設定してください",
          },
        ],
      },
      {
        testName: "更新者IDが6桁でない(7桁入力である)",
        updatedId: "test012",
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
    ])("[異常系]$testName場合、ステータス[400]でレスポンスされること", async ({ updatedId, expectedLog }) => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: "100",
          updatedId: updatedId,
        },
      };
      //serviceの戻り値をモック
      const spyUpdate = jest.spyOn(productService, "update");

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //商品情報更新取得処理が呼ばれていないことを検証
      expect(spyUpdate).not.toHaveBeenCalled();
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ errors: expectedLog });
    });

    // NotFoundErrorのテスト
    test("[異常系] ServiceでNotFoundError発生時、ステータス[404]でレスポンスされること", async () => {
      const productCode = "aa00001";

      const req = {
        params: {
          productCode: productCode,
        },
        body: {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: "100",
          updatedId: "test01",
        },
      };

      //serviceエラーモック
      const expectedError = new NotFoundError(productCode, "この商品コードは存在していません");
      const spyUpdate = jest.spyOn(productService, "update").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(productCode, {
        productName: "醤油",
        orderClientCode: "aaaa0001",
        productPrice: "100",
        updatedId: "test01",
      });

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);

      //レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: productCode,
            message: "この商品コードは存在していません",
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
          productPrice: "100",
          updatedId: "test01",
        },
      };

      //serviceエラーモック
      const expectedError = new ValidationError("orderClientCode", "発注先コードは設定できません");
      const spyUpdate = jest.spyOn(productService, "update").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //Service呼び出し確認
      expect(spyUpdate).toHaveBeenCalledTimes(1);

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);

      //レスポンス送信の検証
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

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          productCode: "aa00001",
        },
        body: {
          productName: "醤油",
          productPrice: "100",
          orderClientCode: "aa000001",
          updatedId: "test01",
        },
      };

      //serviceエラーモック
      const expectedError = new Error();
      const spyUpdate = jest.spyOn(productService, "update").mockRejectedValue(expectedError);
      //console.logモック
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      //テスト対象関数の呼び出し
      await productController.update(req, res);

      //Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith("aa00001", {
        productName: "醤油",
        productPrice: "100",
        orderClientCode: "aa000001",
        updatedId: "test01",
      });

      //エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);

      //レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);

      //レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("validate 登録・更新共通バリデーション", () => {
    test("[正常系]バリデーションエラーがない場合、空配列が返却されること", () => {
      //登録データ
      const product = {
        productName: "醤油",
        productPrice: "100",
      };

      //テスト対象関数の呼び出し
      const actual = productController.validate(product);

      //バリデーション結果の検証
      expect(actual).toEqual([]);
    });
    test.each([
      {
        testName: "商品名が19文字",
        productName: "aaaaabbbbbcccccdefg",
      },
      {
        testName: "商品名が20文字",
        productName: "aaaaabbbbbcccccdefgh",
      },
    ])("[正常系]商品名が$testNameの場合、バリデーションエラーがなく空配列が返却されること", ({ productName }) => {
      const product = {
        productName,
        productPrice: "100",
      };
      const actual = productController.validate(product);
      expect(actual).toEqual([]);
    });
    test("[異常系]複数のバリデーションエラーがある場合、エラー情報が複数件返却されること", () => {
      // 登録データ
      const product = {
        productName: "",
        productPrice: "-1",
      };

      // テスト対象関数の呼び出し
      const actual = productController.validate(product);

      // バリデーション結果の検証
      expect(actual).toEqual([
        {
          field: "productName",
          message: "商品名が設定されていません",
        },
        {
          field: "productPrice",
          message: "単価は1以上で設定してください",
        },
      ]);
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
        testName: "商品名が20文字以内で設定されていない(21文字で入力されている)",
        productName: "aaaaabbbbbcccccddddde",
        expectedLog: [
          {
            field: "productName",
            message: "商品名は20桁以内で設定してください",
          },
        ],
      },
    ])(
      "[異常系]$testName場合、エラー情報配列に形式チェックエラーの情報を追加するされること",
      async ({ productName, expectedLog }) => {
        const product = {
          productName: productName,
          productPrice: "100",
        };

        //テスト対象関数の呼び出し
        const actual = await productController.validate(product);

        expect(actual).toEqual(expectedLog);
      },
    );

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
        testName: "単価が1以上で設定されていない(-1で設定されている)",
        productPrice: "-1",
        expectedLog: [
          {
            field: "productPrice",
            message: "単価は1以上で設定してください",
          },
        ],
      },
      {
        testName: "単価が1以上で設定されていない(0で設定されている)",
        productPrice: "0",
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
    ])(
      "[異常系]$testName場合、エラー情報配列に形式チェックエラーの情報を追加されること",
      async ({ productPrice, expectedLog }) => {
        const product = {
          productName: "醤油",
          orderClientCode: "aaaa0001",
          productPrice: productPrice,
          updatedId: "test01",
        };

        //テスト対象関数の呼び出し
        const actual = await productController.validate(product);

        expect(actual).toEqual(expectedLog);
      },
    );
  });
});
