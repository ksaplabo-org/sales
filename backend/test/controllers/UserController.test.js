import { jest } from "@jest/globals";

import userController from "../../src/controllers/UserController.js";
import userService from "../../src/services/UserService.js";
import ForbiddenError from "../../src/errors/ForbiddenError.js";

// 全テストケース実行後に行う処理
afterEach(() => {
  // Mockをすべて初期化
  jest.resetAllMocks();
});

describe("UserController", () => {
  // 各テストで使用するレスポンス引数のMock
  let res;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

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

  describe("findById ユーザー情報詳細取得", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          // 取得対象のユーザーID
          userId: "test01",
        },
        user: {
          // ログインユーザー情報
          userId: "test01",
          role: "2",
        },
      };
      // 期待結果
      const expectedResult = [{ userId: "test01", lastName: "テスト", firstName: "太郎", role: "2" }];
      //Service呼び出しの監視
      const spyFindById = jest.spyOn(userService, "findById").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await userController.findById(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(req.params.userId, req.user.userId, req.user.role);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test("[異常系] 異常な認可情報を送信すると、ステータス[403]のエラーがレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          // 取得対象のユーザーID
          userId: "test03",
        },
        user: {
          // ログインユーザー情報
          userId: "test04",
          role: "1",
        },
      };
      // 期待結果
      const expectedError = new ForbiddenError();
      //Service呼び出しの監視
      const spyFindById = jest.spyOn(userService, "findById").mockRejectedValueOnce(expectedError);

      // テスト対象関数の呼び出し
      await userController.findById(req, res);

      // Serviceの呼び出しを検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(req.params.userId, req.user.userId, req.user.role);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(403); // 403が設定されていることを検証
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("update ユーザー情報更新", () => {
    test("[正常系] 検索条件がServiceに渡され、ステータス[200]とServiceの結果がレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          // 取得対象のユーザーID
          userId: "test01",
        },
        body: {
          // 更新情報
          userId: "test01",
          firstName: "テスト",
          lastName: "太郎",
          password: "test01",
          birthday: "2002-09-07",
        },
        user: {
          // ログインユーザー情報
          userId: "test01",
          role: "2",
        },
      };
      //Service呼び出しの監視
      const spyUpdate = jest.spyOn(userService, "update").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await userController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(req.params.userId, req.body, req.user.userId, req.user.role);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(0); // 呼び出しされないことでデフォルト値である200が設定されていることを検証
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系] 異常な認可情報を送信すると、ステータス[403]のエラーがレスポンスされること", async () => {
      // 検索条件
      const req = {
        params: {
          // 取得対象のユーザーID
          userId: "test03",
        },
        body: {
          // 更新情報
          userId: "test03",
          firstName: "テスト",
          lastName: "次郎",
          password: "test03",
          birthday: "2005-02-24",
        },
        user: {
          // ログインユーザー情報
          userId: "test04",
          role: "1",
        },
      };
      // 期待結果
      const expectedError = new ForbiddenError();
      //Service呼び出しの監視
      const spyUpdate = jest.spyOn(userService, "update").mockRejectedValue(expectedError);

      // テスト対象関数の呼び出し
      await userController.update(req, res);

      // Serviceの呼び出しを検証
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(req.params.userId, req.body, req.user.userId, req.user.role);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(403); // 403が設定されていることを検証
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });
});
