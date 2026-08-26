import { jest } from "@jest/globals";

import orderController from "../../src/controllers/orderController.js";
import orderService from "../../src/services/orderService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UnprocessableContentError from "../../src/errors/UnprocessableContentError.js";

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
          orderDate: "2026-1-1",
          confirmedDate: "",
          amountTaxIncluded: "20000",
        },
        {
          orderNo: "o2000001",
          orderKbn: "2",
          clientCode: "cc000002",
          productCode: "pc00002",
          orderDate: "2026-1-2",
          confirmedDate: "2026-1-3",
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

  describe("delete 受発注情報削除", () => {
    test("[正常系] 受発注番号がServiceに渡され、正常終了すること", async () => {
      // リクエスト
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
      // リクエスト
      const req = {
        params: {},
      };

      // Spy設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

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
      // リクエスト
      const req = {
        params: {
          orderNo: "o100000",
        },
      };

      // Spy設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
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
      // リクエスト
      const req = {
        params: {
          orderNo: "o10000010",
        },
      };

      // Spy設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
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
      // リクエスト
      const req = {
        params: {
          orderNo: "o1@@@@@1",
        },
      };

      // Spy設定
      const spy = jest.spyOn(orderService, "delete");

      // テスト対象関数の呼び出し
      await orderController.delete(req, res);

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

    test("[異常系] NotFoundError発生時、404エラーとなること", async () => {
      // リクエスト
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
      // リクエスト
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
      // リクエスト
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
    });
  });
});
