import { jest } from "@jest/globals";

import clientController from "../../src/controllers/clientController.js";
import clientService from "../../src/services/clientService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";
import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";

//各テストケースの後に実行される処理
afterEach(() => {
  // Mockを全て初期化
  jest.clearAllMocks();
});

//ClientControlerテスト
describe("clientController", () => {
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
          clientCode: "test",
          clientName: "テスト",
          orderKbn: "1",
        },
      };

      // Mock設定
      const expectedResult = [
        { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" },
        { clientCode: "test0002", clientName: "Bテスト商事", orderKbn: "1" },
      ];

      //Serviceの呼び出しを監視
      const spy = jest.spyOn(clientService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await clientController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientCode: "test",
        clientName: "テスト",
        orderKbn: "1",
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
      const spyFindAll = jest.spyOn(clientService, "findAll").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.findAll(req, res);

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
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
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
      const spy = jest.spyOn(clientService, "findByCode").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test0001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] 取引先コードが未設定の場合、400エラーとメッセージを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "",
        },
      };

      // Mock設定
      const spy = jest.spyOn(clientService, "findByCode").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

      // Service呼び出し検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードが設定されていません",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが7桁の場合、400エラーとメッセージを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a000000",
        },
      };

      // Mock設定
      const spy = jest.spyOn(clientService, "findByCode").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

      // Service呼び出し検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが9桁の場合、400エラーとメッセージを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a00000001",
        },
      };

      // Mock設定
      const spy = jest.spyOn(clientService, "findByCode").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

      // Service呼び出し検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが半角英数でない場合、400エラーとメッセージを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "あいうえおかきく",
        },
      };

      // Mock設定
      const spy = jest.spyOn(clientService, "findByCode").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

      // Service呼び出し検証
      expect(spy).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
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
      // 検索条件
      const req = {
        params: {
          clientCode: "test1000",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("clientCode", "この取引先情報は存在しません");
      const spyFindByCode = jest.spyOn(clientService, "findByCode").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

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
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyFindByCode = jest.spyOn(clientService, "findByCode").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.findByCode(req, res);

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

  describe("create 取引先情報登録", () => {
    test("[正常系] 登録情報がServiceに渡され、ステータス[201]でレスポンスされること", async () => {
      const req = {
        body: {
          clientCode: "test0001",
          clientName: "Cテスト有限会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
        },
      };

      const spy = jest.spyOn(clientService, "create").mockResolvedValue();

      await clientController.create(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientCode: "test0001",
        clientName: "Cテスト有限会社",
        orderKbn: "1",
        postCode: "",
        address1: "",
        address2: "",
        telNumber: "",
        createdId: "user01",
        updatedId: "user01",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    const normalData = {
      clientCode: "a0000001",
      clientName: "Cテスト株式会社",
      orderKbn: "1",
      postCode: "",
      address1: "",
      address2: "",
      telNumber: "",
      createdId: "user01",
      updatedId: "user01",
    };

    test.each([
      [
        "取引先コード未設定である",
        {
          clientCode: "",
        },
        {
          field: "clientCode",
          message: "取引先コードが設定されていません",
        },
      ],
      [
        "取引先コードが7桁である",
        {
          clientCode: "test000",
        },
        {
          field: "clientCode",
          message: "取引先コードは8桁で設定してください",
        },
      ],
      [
        "取引先コードが9桁である",
        {
          clientCode: "test00001",
        },
        {
          field: "clientCode",
          message: "取引先コードは8桁で設定してください",
        },
      ],
      [
        "取引先コードが半角英数ではない",
        {
          clientCode: "あいうえおかきく",
        },
        {
          field: "clientCode",
          message: "取引先コードは半角英数で設定してください",
        },
      ],
      [
        "受発注区分未設定である",
        {
          orderKbn: "",
        },
        {
          field: "orderKbn",
          message: "受発注区分が設定されていません",
        },
      ],
      [
        "受発注区分が不正である",
        {
          orderKbn: "9",
        },
        {
          field: "orderKbn",
          message: "受発注区分は'1'か'2'を設定してください",
        },
      ],
      [
        "登録者ID未設定である",
        {
          createdId: "",
        },
        {
          field: "createdId",
          message: "登録者IDが設定されていません",
        },
      ],
      [
        "登録者IDが5桁である",
        {
          createdId: "user0",
        },
        {
          field: "createdId",
          message: "登録者IDは6桁で設定してください",
        },
      ],
      [
        "登録者IDが7桁である",
        {
          createdId: "user001",
        },
        {
          field: "createdId",
          message: "登録者IDは6桁で設定してください",
        },
      ],
      [
        "登録者IDが半角英数ではない",
        {
          createdId: "あいうえおか",
        },
        {
          field: "createdId",
          message: "登録者IDは半角英数で設定してください",
        },
      ],
    ])("[異常系] %s 場合、400エラーを返却すること", async (_, invalidBody, expectedError) => {
      const req = {
        body: {
          ...normalData,
          ...invalidBody,
        },
      };

      await clientController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [expectedError],
      });
    });

    test("[異常系] Serviceで一意制約エラー発生時、ステータス[409]でレスポンスされること", async () => {
      const req = {
        body: {
          clientCode: "test0001",
          clientName: "Cテスト有限会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
        },
      };

      const expectedError = new UniqueConstraintError("clientCode", "この取引先コードは既に使用されています");

      const spyCreate = jest.spyOn(clientService, "create").mockRejectedValue(expectedError);

      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      await clientController.create(req, res);

      expect(spyCreate).toHaveBeenCalledTimes(1);
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
        body: {
          clientCode: "test0001",
          clientName: "Cテスト有限会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
        },
      };

      const expectedError = new Error();
      const spyCreate = jest.spyOn(clientService, "create").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      await clientController.create(req, res);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith(expectedError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("update 取引先情報更新", () => {
    test("[正常系] 更新情報がServiceに渡され、ステータス[201]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
        body: {
          clientName: "Cテスト株式会社",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "user01",
        },
      };

      const spy = jest.spyOn(clientService, "update").mockResolvedValue();

      await clientController.update(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test0001", {
        clientName: "Cテスト株式会社",
        postCode: "",
        address1: "",
        address2: "",
        telNumber: "",
        updatedId: "user01",
      });
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    test("[異常系] 取引先コードが未設定の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "",
        },
      };

      await clientController.update(req, res);

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

    test("[異常系] 取引先コードが7桁の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a000000",
        },
      };

      await clientController.update(req, res);

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

    test("[異常系] 取引先コードが9桁の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a00000001",
        },
      };

      await clientController.update(req, res);

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

    test("[異常系] 取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "あいうえおかきく",
        },
      };

      await clientController.update(req, res);

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

    test.each([
      [
        "更新者ID未設定である",
        {
          clientName: "Cテスト株式会社",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "",
        },
        {
          field: "updatedId",
          message: "更新者IDが設定されていません",
        },
      ],
      [
        "更新者IDが5桁である",
        {
          clientName: "Cテスト株式会社",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "user0",
        },
        {
          field: "updatedId",
          message: "更新者IDは6桁で設定してください",
        },
      ],
      [
        "更新者IDが7桁である",
        {
          clientName: "Cテスト株式会社",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "user001",
        },
        {
          field: "updatedId",
          message: "更新者IDは6桁で設定してください",
        },
      ],
      [
        "更新者IDが半角英数ではない",
        {
          clientName: "Cテスト株式会社",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "あいうえおか",
        },
        {
          field: "updatedId",
          message: "更新者IDは半角英数で設定してください",
        },
      ],
    ])("[異常系] %s 場合、400エラーを返却すること", async (_, body, expectedError) => {
      const req = {
        params: {
          clientCode: "test0001",
        },
        body,
      };

      await clientController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [expectedError],
      });
    });
    test("[異常系] 取引先情報が存在しない場合、ステータス[404]でレスポンスされること", async () => {
      const req = {
        params: {
          clientCode: "test0001",
        },
        body: {
          clientName: "テスト",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "user01",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("clientCode", "この取引先情報は存在しません");
      const spyUpdate = jest.spyOn(clientService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith("test0001", req.body);
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
        body: {
          clientName: "テスト",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          updatedId: "user01",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyUpdate = jest.spyOn(clientService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith("test0001", req.body);
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
    test("[正常系] 削除対象の取引先コードがServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedResult = undefined;
      const spy = jest.spyOn(clientService, "delete").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test0001");
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系] 取引先コードが未設定の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "",
        },
      };

      // Mock設定
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードが設定されていません",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが7桁の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a000000",
        },
      };

      // Mock設定
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが9桁の場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a00000001",
        },
      };

      // Mock設定
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "clientCode",
            message: "取引先コードは8桁で設定してください",
          },
        ],
      });
    });

    test("[異常系] 取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "あいうえおかきく",
        },
      };

      // Mock設定
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).not.toHaveBeenCalled();
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
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
      // 検索条件
      const req = {
        params: {
          clientCode: "test1000",
        },
      };

      // Mock設定
      const expectedError = new NotFoundError("clientCode", "この取引先情報は存在しません");
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("test1000");
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
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new ReferenceConstraintError(
        "clientCode",
        "取引先情報が受発注情報で使用されているため削除できません",
      );
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledWith("test0001");
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
      // 検索条件
      const req = {
        params: {
          clientCode: "test0001",
        },
      };

      // Mock設定
      const expectedError = new Error();
      const spyDelete = jest.spyOn(clientService, "delete").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      await clientController.delete(req, res);

      // Serviceの呼び出しを検証
      expect(spyDelete).toHaveBeenCalledTimes(1);
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
    test("[正常系] 取引先名が20文字以内の場合、エラーが発生しないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "未設定である",
        clientName: "",
        errors: {
          field: "clientName",
          message: "取引先名が設定されていません",
        },
      },
      {
        name: "21文字以上である",
        clientName: "あいうえおかきくけこさしすせそたちつてとな",
        errors: {
          field: "clientName",
          message: "取引先名は20文字以内で設定してください",
        },
      },
    ])("[異常系] 取引先名が$name場合、エラーが発生すること", ({ clientName, errors }) => {
      const result = clientController.validate({
        clientName,
      });
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 郵便番号が7桁の場合、エラーが発生しないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        postCode: "1234567",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "6桁である",
        postCode: "123456",
        errors: {
          field: "postCode",
          message: "郵便番号は7桁で設定してください",
        },
      },
      {
        name: "8桁である",
        postCode: "12345678",
        errors: {
          field: "postCode",
          message: "郵便番号は7桁で設定してください",
        },
      },
      {
        name: "半角数字ではない",
        postCode: "あいうえおab",
        errors: {
          field: "postCode",
          message: "郵便番号は半角数字で設定してください",
        },
      },
    ])("[異常系] 郵便番号が$name場合、エラーが発生すること", ({ postCode, errors }) => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        postCode,
      });
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 住所1が20文字以内の場合、エラーが発生しないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address1: "あいうえおかきくけこさしすせそたちつてと",
      });

      expect(result).toEqual([]);
    });

    test("[異常系] 住所1が21文字の場合、エラーが発生すること", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address1: "あいうえおかきくけこさしすせそたちつてとな",
      });
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          field: "address1",
          message: "住所1は20文字以内で設定してください",
        },
      ]);
    });

    test("[正常系] 住所2が20文字以内の場合、エラーが発生しないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address2: "あいうえおかきくけこさしすせそたちつてと",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test("[異常系] 住所2が21文字の場合、エラーが発生すること", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address2: "あいうえおかきくけこさしすせそたちつてとな",
      });
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          field: "address2",
          message: "住所2は20文字以内で設定してください",
        },
      ]);
    });

    test("[正常系] 電話番号が{数字3桁}-{数字4桁}-{数字4桁}の形式の場合、エラーが発生しないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        telNumber: "123-1234-1234",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test("[異常系] 電話番号が{数字3桁}-{数字4桁}-{数字4桁}の形式ではない場合、エラーが発生すること", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        telNumber: "---1----2----",
      });
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          field: "telNumber",
          message: "電話番号はxxx-xxxx-xxxxで設定してください",
        },
      ]);
    });

    test("[異常系] エラーが複数件発生する場合", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてとな",
        postCode: "12345",
        address1: "あいうえおかきくけこさしすせそたちつてとな",
        address2: "あいうえおかきくけこさしすせそたちつてとな",
        telNumber: "823918320",
      });
      expect(result).toHaveLength(5);
      expect(result).toEqual([
        {
          field: "clientName",
          message: "取引先名は20文字以内で設定してください",
        },
        {
          field: "postCode",
          message: "郵便番号は7桁で設定してください",
        },
        {
          field: "address1",
          message: "住所1は20文字以内で設定してください",
        },
        {
          field: "address2",
          message: "住所2は20文字以内で設定してください",
        },
        {
          field: "telNumber",
          message: "電話番号はxxx-xxxx-xxxxで設定してください",
        },
      ]);
    });
  });
});
