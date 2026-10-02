import { describe, expect, jest, test } from "@jest/globals";

import orderController from "../../src/controllers/orderController.js";
import orderService from "../../src/services/orderService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UnprocessableContentError from "../../src/errors/UnprocessableContentError.js";
import OrderValidationError from "../../src/errors/OrderValidationError.js";

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

describe("orderController", () => {
  describe("findAll 受発注情報一覧取得", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        query: {
          orderNo: "o1000001",
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          amountTaxIncludedLow: "10000",
          amountTaxIncludedHigh: "50000",
        },
      };

      // Mock設定
      const expectedResult = [
        {
          orderNo: "o1000001",
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          orderDate: "2026-01-01",
          confirmedDate: "",
          amountTaxIncluded: "20000",
        },
        {
          orderNo: "o2000001",
          orderKbn: "2",
          clientCode: "cc000002",
          productCode: "pc00002",
          orderDate: "2026-01-02",
          confirmedDate: "2026-01-03",
          amountTaxIncluded: "70000",
        },
      ];
      const spy = jest.spyOn(orderService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await orderController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        orderNo: "o1000001",
        orderKbn: "1",
        clientCode: "cc000001",
        productCode: "pc00001",
        amountTaxIncludedLow: "10000",
        amountTaxIncludedHigh: "50000",
      });
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      // 検索条件
      const req = {
        query: {},
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindAll = jest.spyOn(orderService, "findAll").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await orderController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith({
        orderNo: undefined,
        orderKbn: undefined,
        clientCode: undefined,
        productCode: undefined,
        amountTaxIncludedLow: undefined,
        amountTaxIncludedHigh: undefined,
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

  describe("findByNo 受発注情報詳細取得", () => {
    test("[正常系] 受発注番号がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedResult = [
        {
          orderNo: "o1000001",
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          orderDate: "2026-01-01",
          confirmedDate: "",
          amountTaxIncluded: "20000",
        },
      ];
      const spy = jest.spyOn(orderService, "findByNo").mockResolvedValue(expectedResult);

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("o1000001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] 受発注番号未入力時、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "findByNo");

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号を入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が7桁（8桁以外）の場合、400エラーとなること", async () => {
      //検索条件
      const req = {
        params: {
          orderNo: "o100000",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "findByNo");

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は8桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が9桁（8桁以外）の場合、400エラーとなること", async () => {
      const req = {
        // 検索条件
        params: {
          orderNo: "o10000010",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "findByNo");

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は8桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が半角英数以外の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1@@@@@1",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "findByNo");

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は半角英数で入力してください",
          },
        ],
      });
    });

    test("[異常系] NotFoundError発生時、404エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("orderNo", "この受発注番号は存在しません");
      const spyFindByNo = jest.spyOn(orderService, "findByNo").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByNo).toHaveBeenCalledTimes(1);
      expect(spyFindByNo).toHaveBeenCalledWith("o1000001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "この受発注番号は存在しません",
          },
        ],
      });
    });

    test("[異常系] 想定外エラー発生時、500エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindByNo = jest.spyOn(orderService, "findByNo").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.findByNo(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByNo).toHaveBeenCalledTimes(1);
      expect(spyFindByNo).toHaveBeenCalledWith("o1000001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("update 受発注情報更新", () => {
    test("[正常系] 更新情報がServiceに渡され、正常終了すること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          confirmedDate: "2026-01-02",
          shipDate: "2026-01-03",
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: "10",
          updatedId: "u00001",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update").mockResolvedValue();

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("o1000001", {
        confirmedDate: "2026-01-02",
        shipDate: "2026-01-03",
        deliverDate: "2026-01-04",
        productCode: "pc00001",
        quantity: "10",
        updatedId: "u00001",
      });
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    test("[正常系] 空文字の日付項目がnullに変換されてServiceに渡されること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          confirmedDate: "",
          shipDate: "2026-01-02",
          deliverDate: "",
          productCode: "pc00001",
          quantity: "10",
          updatedId: "u00001",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update").mockResolvedValue();

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("o1000001", {
        confirmedDate: null,
        shipDate: "2026-01-02",
        deliverDate: null,
        productCode: "pc00001",
        quantity: "10",
        updatedId: "u00001",
      });
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    test("[正常系] 発注データの場合、空文字の出荷日がnull変換されてServiceに渡されること", async () => {
      //検索条件
      const req = {
        params: {
          orderNo: "o2000001",
        },
        body: {
          confirmedDate: "",
          shipDate: "",
          deliverDate: "",
          productCode: "pc00001",
          quantity: "10",
          updatedId: "u00001",
        },
      };

      //Mock設定
      const spy = jest.spyOn(orderService, "update").mockResolvedValue();

      //テスト対象関数呼び出し
      await orderController.update(req, res);

      expect(spy).toHaveBeenCalledWith("o2000001", {
        confirmedDate: null,
        shipDate: null,
        deliverDate: null,
        productCode: "pc00001",
        quantity: "10",
        updatedId: "u00001",
      });
    });

    test("[異常系] 受発注番号未入力時、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "",
        },
        body: {},
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号を入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が7桁（8桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o100000",
        },
        body: {},
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("[異常系] 受発注番号が9桁（8桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o10000010",
        },
        body: {},
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("[異常系] 受発注番号が半角英数以外の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1@@@@@1",
        },
        body: {},
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は半角英数で入力してください",
          },
        ],
      });
    });

    test("[異常系] 更新者ID未入力時、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "updatedId",
            message: "更新者IDを入力してください",
          },
        ],
      });
    });

    test("[異常系] 更新者IDが5桁（6桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "u0000",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "updatedId",
            message: "更新者IDは6桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 更新者IDが7桁（6桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "u000010",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "updatedId",
            message: "更新者IDは6桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 更新者IDが半角英数以外の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "u@@@@1",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "update");

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "updatedId",
            message: "更新者IDは半角英数で入力してください",
          },
        ],
      });
    });

    test("[異常系] NotFoundError発生時、404エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          confirmedDate: "2026-01-02",
          shipDate: "2026-01-03",
          deliverDate: "2026-01-04",
          productCode: "pc00000",
          quantity: 10,
          updatedId: "u00001",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("productCode", "この商品コードは存在しません");
      const spyUpdate = jest.spyOn(orderService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith("o1000001", expect.any(Object));
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "productCode",
            message: "この商品コードは存在しません",
          },
        ],
      });
    });

    test("[異常系] OrderValidationError発生時、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          confirmedDate: "2026-01-02",
          shipDate: "2026-01-03",
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "u00001",
        },
      };

      // Mock設定
      const expectedError = new OrderValidationError([{ field: "confirmedDate", message: "確定日は入力できません" }]);
      const spyDelete = jest.spyOn(orderService, "update").mockRejectedValue(expectedError);

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("o1000001", expect.any(Object));
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OrderValidationError.status);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "confirmedDate",
            message: "確定日は入力できません",
          },
        ],
      });
    });

    test("[異常系] 想定外エラー発生時、500エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
        body: {
          confirmedDate: "2026-01-02",
          shipDate: "2026-01-03",
          deliverDate: "2026-01-04",
          productCode: "pc00001",
          quantity: 10,
          updatedId: "u00001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyDelete = jest.spyOn(orderService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("o1000001", expect.any(Object));
      // Serviceの呼び出しを検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete 受発注情報削除", () => {
    test("[正常系] 受発注番号がServiceに渡され、正常終了すること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "delete").mockResolvedValue();

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("o1000001");
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
      // レスポンスステータス設定の検証
      expect(res.status).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注番号未入力時、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {},
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号を入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が7桁（8桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o100000",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は8桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が9桁（8桁以外）の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o10000010",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は8桁で入力してください",
          },
        ],
      });
    });

    test("[異常系] 受発注番号が半角英数以外の場合、400エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1@@@@@1",
        },
      };

      // Mock設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "受発注番号は半角英数で入力してください",
          },
        ],
      });
    });

    test("[異常系] NotFoundError発生時、404エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("orderNo", "この受発注番号は存在しません");
      const spyDelete = jest.spyOn(orderService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("o1000001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "この受発注番号は存在しません",
          },
        ],
      });
    });

    test("[異常系] UnprocessableContentError発生時、422エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedError = new UnprocessableContentError(
        "orderNo",
        "この受発注番号は確定日が登録されているため削除できません",
      );
      const spyDelete = jest.spyOn(orderService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("o1000001");
      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UnprocessableContentError.status);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "orderNo",
            message: "この受発注番号は確定日が登録されているため削除できません",
          },
        ],
      });
    });

    test("[異常系] 想定外エラー発生時、500エラーとなること", async () => {
      // 検索条件
      const req = {
        params: {
          orderNo: "o1000001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyDelete = jest.spyOn(orderService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("o1000001");
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

  describe("validate 登録更新共通バリデーション", () => {
    const data = {
      productCode: "pc00001",
      quantity: "10",
    };
    test.each([
      ["商品コード未入力", { productCode: "" }, { field: "productCode", message: "商品コードを入力してください" }],
      [
        "商品コードが6桁",
        { productCode: "pc0000" },
        { field: "productCode", message: "商品コードは7桁で入力してください" },
      ],
      [
        "商品コードが半角英数以外",
        { productCode: "pc@@@@1" },
        { field: "productCode", message: "商品コードは半角英数で入力してください" },
      ],
      ["数量未入力", { quantity: "" }, { field: "quantity", message: "数量を入力してください" }],
      ["数量が数字以外", { quantity: "abc" }, { field: "quantity", message: "数量は半角数字で入力してください" }],
      ["数量が0", { quantity: "0" }, { field: "quantity", message: "数量は1以上で入力してください" }],
    ])("[異常系] %s", (_, invalidData, expectedError) => {
      const actual = orderController.validate({
        ...data,
        ...invalidData,
      });
      expect(actual).toEqual([expectedError]);
    });
  });
});
