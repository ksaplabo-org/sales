import { jest } from "@jest/globals";

import userController from "../../src/controllers/UserController.js";
import userService from "../../src/services/UserService.js";

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

describe("UserController", () => {
  describe("findAll ユーザー情報一覧取得", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        query: {
          userId: "test01",
        },
      };

      // Mock設定
      const expectedResult = [
        { userId: "a0b001", lastName: "テスト", firstName: "太郎" },
        { userId: "a0b002", lastName: "テスト", firstName: "次郎" },
      ];
      const spy = jest.spyOn(userService, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await userController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        userId: "test01",
        userName: undefined,
        role: undefined,
        includeDeleted: false,
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
      const spyFindAll = jest.spyOn(userService, "findAll").mockRejectedValue(expectedError);
      const spyConsole = jest.spyOn(console, "error").mockResolvedValue();

      // テスト対象関数の呼び出し
      const actual = await userController.findAll(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith({
        userId: undefined,
        userName: undefined,
        role: undefined,
        includeDeleted: false,
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
});