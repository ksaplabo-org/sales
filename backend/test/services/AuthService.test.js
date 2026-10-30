import { expect, jest } from "@jest/globals";

import authService from "../../src/services/AuthService.js";
import userRepository from "../../src/repositories/userRepository.js";
import jwt from "jsonwebtoken";

describe("AuthService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("login ログイン認証", () => {
    // 各テスト共通で使用する引数設定
    const userId = "user01";
    const password = "password";
    // 秘密鍵のMock設定
    process.env.JWT_SECRET = "test-secret";

    test("[正常系] ユーザーID、パスワードが正しい場合 => JWTが返却されること", async () => {
      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce({
        userId: "user01",
        password: "password",
        role: "2",
        delFlg: false,
      });

      jest.useFakeTimers(); // システム時刻の固定
      jest.setSystemTime(new Date("2026-10-29T00:00:00Z")); // JWTに送信する時刻を固定

      // テスト対象関数の呼び出し
      const actual = await authService.login(userId, password);
      const decoded = jwt.verify(actual, process.env.JWT_SECRET);

      // Mockした関数の呼び出し検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(userId);
      // JWTの検証
      expect(decoded.userId).toBe("user01"); // ログインユーザーIDが含まれていることの検証
      expect(decoded.role).toBe("2"); // ログインユーザーの権限が含まれていることの検証
      expect(decoded.exp).toBe(1793235600); // 有効期限が含まれていることの検証
      expect(decoded.exp - decoded.iat).toBe(3600); // 有効期限が1時間であることの検証
    });

    test("[異常系] ユーザーが存在しない場合 => nullが返却されること", async () => {
      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      // テスト対象関数の呼び出し
      const actual = await authService.login(userId, password);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(userId);
      expect(actual).toBeNull();
    });

    test("[異常系] パスワードが不一致の場合 => nullが返却されること", async () => {
      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce({
        userId: "user01",
        password: "test123",
        role: "2",
        delFlg: false,
      });

      // テスト対象関数の呼び出し
      const actual = await authService.login(userId, password);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(userId);
      expect(actual).toBeNull();
    });

    test("[異常系] 削除済みユーザーの場合 => nullが返却されること", async () => {
      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce({
        userId: "user01",
        password: "password",
        role: "2",
        delFlg: true,
      });

      // テスト対象関数の呼び出し
      const actual = await authService.login(userId, password);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(userId);
      expect(actual).toBeNull();
    });
  });
});
