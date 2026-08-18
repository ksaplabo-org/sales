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
        },
      };

      // Mock設定
      const expectedResult = [
        { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" },
        { clientCode: "test0002", clientName: "Bテスト商事", orderKbn: "2" },
      ];

      //Serviceの呼び出しを監視
      const spy = jest.spyOn(clientService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await clientController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientCode: "test",
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

      // Mock設定
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

    test("[異常系]取引先コードが未設定の場合、400エラーとメッセージを返却すること", async () => {
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

    test("[異常系]取引先コードが8桁でない場合、400エラーとメッセージを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a0",
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

    test("[異常系]取引先コードが半角英数でない場合、400エラーとメッセージを返却すること", async () => {
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
      const expectedError = new NotFoundError();
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
      const actual = await clientController.findByCode(req, res);

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

    test.each([
      [
        "取引先コード未設定",
        {
          clientCode: "",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
          updatedId: "user01",
        },
        {
          field: "clientCode",
          message: "取引先コードが設定されていません",
        },
      ],
      [
        "取引先コードが8桁でない",
        {
          clientCode: "test000",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
          updatedId: "user01",
        },
        {
          field: "clientCode",
          message: "取引先コードは8桁で設定してください",
        },
      ],
      [
        "取引先コードが半角英数でない",
        {
          clientCode: "あいうえおかきく",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
          updatedId: "user01",
        },
        {
          field: "clientCode",
          message: "取引先コードは半角英数で設定してください",
        },
      ],
      [
        "受発注区分未設定",
        {
          clientCode: "test0001",
          clientName: "Cテスト株式会社",
          orderKbn: "",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
          updatedId: "user01",
        },
        {
          field: "orderKbn",
          message: "受発注区分が設定されていません",
        },
      ],
      [
        "受発注区分が不正",
        {
          clientCode: "test0001",
          clientName: "Cテスト株式会社",
          orderKbn: "9",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user01",
          updatedId: "user01",
        },
        {
          field: "orderKbn",
          message: "受発注区分は'1'か'2'を設定してください",
        },
      ],
      [
        "登録者ID未設定",
        {
          clientCode: "test0001",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "",
          updatedId: "user01",
        },
        {
          field: "createdId",
          message: "登録者IDが設定されていません",
        },
      ],
      [
        "登録者IDが6桁でない",
        {
          clientCode: "test0001",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "user0",
          updatedId: "user01",
        },
        {
          field: "createdId",
          message: "登録者IDは6桁で設定してください",
        },
      ],
      [
        "登録者IDが半角英数でない",
        {
          clientCode: "test0001",
          clientName: "Cテスト株式会社",
          orderKbn: "1",
          postCode: "",
          address1: "",
          address2: "",
          telNumber: "",
          createdId: "あいうえおか",
          updatedId: "user01",
        },
        {
          field: "createdId",
          message: "登録者IDは半角英数で設定してください",
        },
      ],
    ])("[異常系] %s の場合、400エラーを返却すること", async (_, body, expectedError) => {
      const req = { body };

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

      const expectedError = new UniqueConstraintError();

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

    test("[異常系]取引先コードが未設定の場合、400エラーを返却すること", async () => {
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

    test("[異常系]取引先コードが8桁でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a0",
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

    test("[異常系]取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
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
        "更新者ID未設定",
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
        "更新者IDが6桁でない",
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
        "更新者IDが半角英数でない",
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
    ])("[異常系] %s の場合、400エラーを返却すること", async (_, body, expectedError) => {
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
      const expectedError = new NotFoundError();
      const spyUpdate = jest.spyOn(clientService, "update").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await clientController.update(req, res);

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
      const actual = await clientController.update(req, res);

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

    test("[異常系]取引先コードが未設定の場合、400エラーを返却すること", async () => {
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

    test("[異常系]取引先コードが8桁でない場合、400エラーを返却すること", async () => {
      // 検索条件
      const req = {
        params: {
          clientCode: "a0",
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

    test("[異常系]取引先コードが半角英数でない場合、400エラーを返却すること", async () => {
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
      const expectedError = new NotFoundError();
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
      const expectedError = new ReferenceConstraintError();
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
    test("[正常系] 取引先名が20文字以内場合、エラーがでてこないこと", () => {
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
    ])("[異常系] 取引先名が$name場合、エラーとなること", ({ clientName, errors }) => {
      const result = clientController.validate({
        clientName,
      });
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 郵便番号が7桁の場合、エラーがでてこないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        postCode: "1234567",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "7桁ではない",
        postCode: "123",
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
    ])("[異常系] 郵便番号が$name場合、エラーとなること", ({ postCode, errors }) => {
      const result = clientController.validate({
        postCode,
      });
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 住所1が20文字以内場合、エラーがでてこないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address1: "あいうえおかきくけこさしすせそたちつてと",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "21文字以上である",
        address1: "あいうえおかきくけこさしすせそたちつてとな",
        errors: {
          field: "address1",
          message: "住所1は20文字以内で設定してください",
        },
      },
    ])("[異常系] 住所1が$name場合、エラーとなること", ({ address1, errors }) => {
      const result = clientController.validate({
        address1,
      });
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 住所2が20文字以内場合、エラーがでてこないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        address2: "あいうえおかきくけこさしすせそたちつてと",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "21文字以上である",
        address2: "あいうえおかきくけこさしすせそたちつてとな",
        errors: {
          field: "address2",
          message: "住所2は20文字以内で設定してください",
        },
      },
    ])("[異常系] 住所2が$name場合、エラーとなること", ({ address2, errors }) => {
      const result = clientController.validate({
        address2,
      });
      expect(result).toContainEqual(errors);
    });

    test("[正常系] 電話番号が{数字3桁}-{数字4桁}-{数字4桁}の形式場合、エラーがでてこないこと", () => {
      const result = clientController.validate({
        clientName: "あいうえおかきくけこさしすせそたちつてと",
        telNumber: "123-1234-1234",
      });
      const errors = [];
      expect(result).toEqual(errors);
    });

    test.each([
      {
        name: "xxx-xxxx-xxxx以外の形式である",
        telNumber: "---1----2----",
        errors: {
          field: "telNumber",
          message: "電話番号はxxx-xxxx-xxxxで設定してください",
        },
      },
    ])("[異常系] 電話番号が$name場合、エラーとなること", ({ _, telNumber, errors }) => {
      const result = clientController.validate({
        telNumber,
      });
      expect(result).toContainEqual(errors);
    });
  });
});
