import { jest } from "@jest/globals";

import orderController from "../../src/controllers/orderController.js";
import orderService from "../../src/services/orderService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UnprocessableContentError from "../../src/errors/UnprocessableContentError.js";
import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";

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

  describe("create 受発注情報登録", () => {
    test("[正常系] 登録情報がServiceに渡され、ステータス[201]でレスポンスされること", async () => {
      const spy = jest.spyOn(orderService, "create").mockResolvedValue();

      await orderController.create(orderData, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmedDate: null,
          shipDate: null,
          deliverDate: null,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
    const orderData = {
      body: {
        orderNo: "o1000001",
        orderKbn: "1",
        clientCode: "cc000001",
        orderDate: "2026-01-01",
        confirmedDate: "",
        shipDate: "",
        deliverDate: "",
        productCode: "pc00001",
        quantity: 10,
        createdId: "u00001",
      },
    };
    test.each([
      ["受発注番号未入力", { orderNo: "" }, { field: "orderNo", message: "受発注番号を入力してください" }],
      ["受発注番号が7桁", { orderNo: "o100000" }, { field: "orderNo", message: "受発注番号は8桁で入力してください" }],
      [
        "受発注番号が半角英数以外",
        { orderNo: "o1@@@@@1" },
        { field: "orderNo", message: "受発注番号は半角英数で入力してください" },
      ],
      ["受発注区分が未入力", { orderKbn: "" }, { field: "orderKbn", message: "受発注区分を入力してください" }],
      ["受発注区分が不正", { orderKbn: "3" }, { field: "orderKbn", message: "受発注区分は1か2を入力してください" }],
      ["取引先コード未入力", { clientCode: "" }, { field: "clientCode", message: "取引先コードを入力してください" }],
      [
        "取引先コードが7桁",
        { clientCode: "cc00000" },
        { field: "clientCode", message: "取引先コードは8桁で入力してください" },
      ],
      [
        "取引先コードが半角英数以外",
        { clientCode: "cc@@@@@1" },
        { field: "clientCode", message: "取引先コードは半角英数で入力してください" },
      ],
      ["受発注日が未入力", { orderDate: "" }, { field: "orderDate", message: "受発注日を入力してください" }],
      [
        "受発注日の値が不正",
        { orderDate: "22026-01-01" },
        { field: "orderDate", message: "日付はyyyy-MM-ddの形式で入力してください" },
      ],
      [
        "受発注日の形式が不正",
        { orderDate: "2026-09-31" },
        { field: "orderDate", message: "正しい日付を入力してください" },
      ],
      [
        "確定日の値が不正",
        { confirmedDate: "22026-01-02" },
        { field: "confirmedDate", message: "日付はyyyy-MM-ddの形式で入力してください" },
      ],
      [
        "確定日の形式が不正",
        { confirmedDate: "2026-09-31" },
        { field: "confirmedDate", message: "正しい日付を入力してください" },
      ],
      [
        "確定日が受発注日より前",
        { orderDate: "2026-01-02", confirmedDate: "2026-01-01" },
        { field: "confirmedDate", message: "確定日は受発注日以降の日付を入力してください" },
      ],
      [
        "発注で出荷日入力",
        { orderKbn: "2", shipDate: "2026-01-03" },
        { field: "shipDate", message: "出荷日は入力できません" },
      ],
      [
        "出荷日の値が不正",
        { shipDate: "22026-01-03" },
        { field: "shipDate", message: "日付はyyyy-MM-ddの形式で入力してください" },
      ],
      [
        "出荷日の形式が不正",
        { shipDate: "2026-09-31" },
        { field: "shipDate", message: "正しい日付を入力してください" },
      ],
      [
        "出荷日が受発注日より前",
        { orderDate: "2026-01-02", shipDate: "2026-01-01" },
        { field: "shipDate", message: "出荷日は受注日以降の日付を入力してください" },
      ],
      [
        "出荷日が確定日より前",
        { confirmedDate: "2026-01-02", shipDate: "2026-01-01" },
        { field: "shipDate", message: "出荷日は入金日以降の日付を入力してください" },
      ],

      [
        "納品予定日の値が不正",
        { deliverDate: "22026-01-04" },
        { field: "deliverDate", message: "日付はyyyy-MM-ddの形式で入力してください" },
      ],
      [
        "納品予定日の形式が不正",
        { deliverDate: "2026-09-31" },
        { field: "deliverDate", message: "正しい日付を入力してください" },
      ],
      [
        "納品予定日が受発注日より前",
        { orderDate: "2026-01-02", deliverDate: "2026-01-01" },
        { field: "deliverDate", message: "納品予定日は受発注日以降の日付を入力してください" },
      ],
      [
        "納品予定日が確定日より前",
        { confirmedDate: "2026-01-02", deliverDate: "2026-01-01" },
        { field: "deliverDate", message: "納品予定日は確定日以降の日付を入力してください" },
      ],
      [
        "納品予定日が出荷日より前",
        { shipDate: "2026-01-02", deliverDate: "2026-01-01" },
        { field: "deliverDate", message: "納品予定日は出荷日以降の日付を入力してください" },
      ],
      ["登録者ID未入力", { createdId: "" }, { field: "createdId", message: "登録者IDを入力してください" }],
      ["登録者IDが5桁", { createdId: "u0000" }, { field: "createdId", message: "登録者IDは6桁で入力してください" }],
      [
        "登録者IDが半角英数以外",
        { createdId: "u@@@@1" },
        { field: "createdId", message: "登録者IDは半角英数で入力してください" },
      ],
    ])("[異常系] %s 場合、400エラーを返却すること", async (_, invalidBody, expectedError) => {
      const req = {
        body: {
          ...orderData.body,
          ...invalidBody,
        },
      };
      await orderController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [expectedError],
      });
    });

    test("[異常系] UniqueConstraintError発生時、409エラーとなること", async () => {
      const req = orderData;
      const expectedError = new UniqueConstraintError("orderNo", "この受発注番号は既に使用されています");
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      jest.spyOn(orderService, "create").mockRejectedValue(expectedError);

      await orderController.create(req, res);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      expect(res.status).toHaveBeenCalledWith(UniqueConstraintError.status);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ field: "orderNo", message: "この受発注番号は既に使用されています" }],
      });
    });
    test("[異常系] NotFoundError発生時、404エラーとなること", async () => {
      const req = orderData;
      const expectedError = new NotFoundError("clientCode", "この取引先コードは存在しません");
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      jest.spyOn(orderService, "create").mockRejectedValue(expectedError);

      await orderController.create(req, res);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      expect(res.status).toHaveBeenCalledWith(NotFoundError.status);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ field: "clientCode", message: "この取引先コードは存在しません" }],
      });
    });
    test("[異常系] Serviceでエラー発生時、500エラーとなること", async () => {
      const req = orderData;
      const expectedError = new Error();
      const spyConsole = jest.spyOn(console, "log").mockImplementation();

      jest.spyOn(orderService, "create").mockRejectedValue(expectedError);

      await orderController.create(req, res);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
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
      // リクエスト
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
      // リクエスト
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
      // リクエスト
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
