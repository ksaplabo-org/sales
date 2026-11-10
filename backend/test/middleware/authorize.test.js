import { jest } from "@jest/globals";

import authorizeRole from "../../src/middleware/authorize.js";

//各テストケースの後に実行される処理
afterEach(() => {
  // Mockを全て初期化
  jest.resetAllMocks();
});

describe("authorizeRole 認可チェック", () => {
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

  test("[正常系] 要求権限にログインユーザーの権限が含まれる場合、次の処理に移動すること", () => {
    // 要求権限
    const roles = ["2"];
    // 引数設定
    const req = { user: { role: "2" } };

    // テスト対象関数の呼び出し
    authorizeRole(roles)(req, res, next);

    // Mock関数の呼び出しを検証
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("[異常系] 要求権限にログインユーザーの権限が含まれない場合、ステータス[403]がレスポンスされること", () => {
    // 要求権限
    const roles = ["1"];
    // 引数設定
    const req = { user: { role: "2" } };

    // テスト対象関数の呼び出し
    authorizeRole(roles)(req, res, next);

    // Mock関数が呼び出されないことを検証
    expect(next).toHaveBeenCalledTimes(0);
    // レスポンスステータス設定の検証
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    // レスポンス送信の検証
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith();
  });
});
