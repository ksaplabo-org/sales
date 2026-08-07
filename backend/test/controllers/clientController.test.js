import { jest } from "@jest/globals";

import ClientController from "../../src/controllers/clientController.js";
import ClientService from "../../src/services/clientService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";

  //各テストケースの後に実行される処理
  afterEach(() => {
    // Mockを全て初期化
    jest.clearAllMocks();
  });

//ClientControlerテスト
describe("ClientController", () => {
  // 各テストで使用するレスポンス引数のMock
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  describe("findAll 取引先情報一覧取得", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        query: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedResult = [
        { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" },
        { clientCode: "test0002", clientName: "Bテスト商事", orderKbn: "2" },
      ];
      const spy = jest.spyOn(ClientService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await ClientController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientCode: "test0001",
        clientName: undefined,
        orderKbn: undefined,
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
      const spyFindAll = jest.spyOn(ClientService, "findAll").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith({
        clientCode: undefined,
        clientName: undefined,
        orderKbn: undefined,
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

  describe("findByCode 取引先情報詳細取得", () => {
    test("[正常系]検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedResult = [
        {
          clientCode: "test0001",
          clientName: "Aテスト会社",
          orderKbn: "1",
          postCode: "1234567",
          address1: "A県B市C区中央南1条西1丁目13番地",
          address2: "ABCビル3階",
          telNumber: "333-4444-4444",
        },
      ];
      const spy = jest.spyOn(ClientService, "findByCode").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      const actual = await ClientController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test0001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系]取引先コードが未設定の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "",
        },
      };

      await ClientController.findByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードが設定されていません",
          },
        ],
      });
    });

    test("[異常系]取引先コードが8桁でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a0",
        },
      };

      await ClientController.findByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系]取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "あいうえおかきく",
        },
      };

      await ClientController.findByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは半角英数で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先情報が存在しない場合、ステータス[404]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test1000",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError();
      const spyFindByCode = jest.spyOn(ClientService, "findByCode").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("test1000");

      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: expectedError.field,
            message: expectedError.message,
          },
        ],
      });
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindByCode = jest.spyOn(ClientService, "findByCode").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("test0001");

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

  describe("delete 取引先情報削除", () => {
    test("[正常系] ", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedResult = [];
      const spy = jest.spyOn(ClientService, "delete").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      const actual = await ClientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test0001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系]取引先コードが未設定の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "",
        },
      };

      await ClientController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードが設定されていません",
          },
        ],
      });
    });

    test("[異常系]取引先コードが8桁でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a0",
        },
      };

      const spyDelete = jest.spyOn(ClientService, "delete");
      await ClientController.delete(req, res);
      expect(spyDelete).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系]取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "あいうえおかきく",
        },
      };

      const spyDelete = jest.spyOn(ClientService, "delete");
      await ClientController.delete(req, res);
      expect(spyDelete).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは半角英数で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先情報が存在しない場合、ステータス[404]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError();
      const spyFindByCode = jest.spyOn(ClientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("test0001");

      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: expectedError.field,
            message: expectedError.message,
          },
        ],
      });
    });

    test("[異常系] 取引先コードが受発注情報に使用されている場合、ステータス[409]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new ReferenceConstraintError();
      const spyFindByCode = jest.spyOn(ClientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("test0001");

      // エラー発生時のログ出力を検証
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(409);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: expectedError.field,
            message: expectedError.message,
          },
        ],
      });
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindByCode = jest.spyOn(ClientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await ClientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith("test0001");

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
});
