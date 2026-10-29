import { jest } from "@jest/globals";

import AuthController from "../../src/controllers/AuthController.js";
import AuthService from "../../src/services/AuthService.js";
import NotFoundError from "../../src/errors/NotFoundError.js";

//各テストケースの後に実行される処理
afterEach(() => {
  // Mockを全て初期化
  jest.resetAllMocks();
});

//ClientControlerテスト
describe("AuthController", () => {
  // 各テストで使用するレスポンス引数のMock
  let res;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("login ログイン認証処理", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // リクエスト引数設定
      const req = {
        body: {
          userId: "test1",
          password: "test1",
        },
      };
      const reqBody = req.body;
      let status = 200;

      // Mock設定
      const expectedResult = "dummy-accessToken";

      //Serviceの呼び出しを監視
      const spyLogin = jest.spyOn(AuthService, "login").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await AuthController.login(req, res);

      // Serviceの呼び出しを検証
      expect(spyLogin).toHaveBeenCalledTimes(1);
      expect(spyLogin).toHaveBeenCalledWith(reqBody.userId, reqBody.password);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200); // ステータスが200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] Serviceでエラー発生時、ステータス[401]でレスポンスされること", async () => {
      // リクエスト引数設定
      const req = {
        body: {
          userId: "test1",
          password: "test1",
        },
      };
      //リクエストボディ取得
      const reqBody = req.body;
      let status = 200;

      // Mock設定
      const expectedResult = null;
      const spyLogin = jest.spyOn(AuthService, "login").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await AuthController.login(req, res);

      // Serviceの呼び出しを検証
      expect(spyLogin).toHaveBeenCalledTimes(1);
      expect(spyLogin).toHaveBeenCalledWith(reqBody.userId, reqBody.password);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系] Serviceでエラー発生時、ステータス[500]でレスポンスされること", async () => {
      // リクエスト引数設定
      const req = {
        body: {
          userId: "test1",
          password: "test1",
        },
      };
      //リクエストボディ取得
      const reqBody = req.body;
      let status = 200;

      // Mock設定
      const expectedError = new Error();
      const spyLogin = jest.spyOn(AuthService, "login").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "log");
      // テスト対象関数の呼び出し
      await AuthController.login(req, res);

      // Serviceの呼び出しを検証
      expect(spyLogin).toHaveBeenCalledTimes(1);
      expect(spyLogin).toHaveBeenCalledWith(reqBody.userId, reqBody.password);
      // ログ出力を検証
      expect(spyConsole).toHaveBeenNthCalledWith(1, "failed to verify accessToken.", expectedError);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });
});
