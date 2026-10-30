import { jest } from "@jest/globals";

import jwt from "jsonwebtoken";
import authenticateToken from "../../src/middleware/auth.js";

//各テストケースの後に実行される処理
afterEach(() => {
  // Mockを全て初期化
  jest.resetAllMocks();
});

describe("authMiddleware", () => {
  let res; // 各テストで使用するレスポンス引数のMock
  let next; // 各テストで使用する関数のMock
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("authenticateToken 認証情報のチェックとログインユーザー情報の取得", () => {
    // 各テスト共通の秘密鍵のMock設定
    process.env.JWT_SECRET = "test-secret";

    test("[正常系] 正常な認証情報である場合、ログインユーザ情報を取得し、リクエストに格納されること", () => {
      // トークン設定
      const token = jwt.sign(
        {
          userId: "test01",
          role: "2",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      // 引数設定
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // テスト対象関数の呼び出し
      authenticateToken(req, res, next);

      // Mock関数の呼び出しを検証
      expect(next).toHaveBeenCalledTimes(1);
      // ログインユーザ情報がリクエストに格納されていることを検証
      expect(req.user.userId).toBe("test01");
      expect(req.user.role).toBe("2");
    });

    test("[異常系] 認証情報の先頭が[Bearer ]ではない場合、ステータス[401]がレスポンスされること", () => {
      // トークン設定
      const token = jwt.sign(
        {
          userId: "test01",
          role: "2",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      // 引数設定
      const req = {
        headers: {
          authorization: `abcdef ${token}`,
        },
      };

      // テスト対象関数の呼び出し
      authenticateToken(req, res, next);

      // Mock関数の呼び出しを検証
      expect(next).toHaveBeenCalledTimes(0);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });

    test("[異常系] 異常な認証情報である場合、ステータス[401]がレスポンスされること", () => {
      // トークン設定
      const token = "dummy-accessToke";
      // 引数設定
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // テスト対象関数の呼び出し
      authenticateToken(req, res, next);

      // Mock関数の呼び出しを検証
      expect(next).toHaveBeenCalledTimes(0);
      // レスポンスステータス設定の検証
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      // レスポンス送信の検証
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith();
    });
  });
});
