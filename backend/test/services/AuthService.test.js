import { expect, jest } from "@jest/globals";

import authService from "../../src/services/AuthService.js";
import userRepository from "../../src/repositories/userRepository.js";

describe("AuthService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("login ログイン認証", () => {
    test("[正常系] ユーザーID、パスワードが正しい場合 => JWTが返却されること", async () => {
      // 検索条件
      const userId = "user01";
      const password = "password";

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce({
        userId: "user01",
        password: "password",
        role: "2",
        delFlg: false,
      });

      // テスト対象関数の呼び出し
      const actual = await authService.login(userId, password);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(userId);
      expect(actual).not.toBeNull();
    });

    test("[異常系] ユーザーが存在しない場合 => nullが返却されること", async () => {
      // 検索条件
      const userId = "user01";
      const password = "password";

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
      // 検索条件
      const userId = "user01";
      const password = "password";

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
      // 検索条件
      const userId = "user01";
      const password = "password";

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
