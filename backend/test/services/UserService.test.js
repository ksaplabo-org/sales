import { jest } from "@jest/globals";

import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import userService from "../../src/services/UserService.js";
import userRepository from "../../src/repositories/UserRepository.js";

describe("UserService", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll ユーザー情報一覧取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const condition = { userId: "a0b00", userName: "テスト" };
      // 期待結果
      const expected = [
        { userId: "a0b001", lastName: "テスト", firstName: "太郎" },
        { userId: "a0b002", lastName: "テスト", firstName: "次郎" },
      ];

      // Mock設定
      const spy = jest.spyOn(userRepository, "findAll").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await userService.findAll(condition);

      // 実行結果と期待結果が一致することを検証
      expect(actual).toEqual(expected);
      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(condition); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("findById ユーザー情報詳細取得", () => {
    test("[正常系] 存在するユーザーIDを指定した場合 => ユーザー情報が返却されること", async () => {
      // 検索条件
      const userId = "a0b001";
      // 期待結果
      const expected = { userId: "a0b001", lastName: "テスト", firstName: "太郎", delFlg: false };

      // Mock設定
      const spy = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await userService.findById(userId);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(userId); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expected); // 実行結果と期待結果が一致することを検証
    });

    test("[異常系] 存在しないユーザーIDを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const userId = "a0b001";

      // Mock設定
      const spy = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      // テスト対象関数の呼び出しと検証
      await expect(userService.findById(userId)).rejects.toThrow(NotFoundError); // スローしたエラーの検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(userId); // Mockした関数呼び出し時の引数を検証
    });

    test("[異常系] 取得したユーザー情報が論理削除されている場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const userId = "a0b001";

      // Mock設定
      const spy = jest
        .spyOn(userRepository, "findById")
        .mockResolvedValueOnce({ userId: "a0b001", lastName: "テスト", firstName: "太郎", delFlg: true });

      // テスト対象関数の呼び出しと検証
      await expect(userService.findById(userId)).rejects.toThrow(NotFoundError); // スローしたエラーの検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(userId); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("create ユーザー情報登録", () => {
    test("[正常系] 存在しないユーザーIDを指定した場合 => 正常終了すること", async () => {
      const userId = "a0b001";
      const userInfo = { userId: userId, lastName: "テスト", firstName: "太郎" };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(userRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await userService.create(userInfo);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数[findById]の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith(userId); // Mockした関数[findById]呼び出し時の引数を検証
      expect(spyCreate).toHaveBeenCalledTimes(1); // Mockした関数[create]の呼び出し回数を検証
      expect(spyCreate).toHaveBeenCalledWith(userInfo); // Mockした関数[create]呼び出し時の引数を検証
    });

    test("[異常系] 存在するユーザーIDを指定した場合 => UniqueConstraintErrorとなること", async () => {
      const userId = "a0b001";
      const userInfo = { userId: userId, lastName: "テスト", firstName: "太郎" };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(userInfo);
      const spyCreate = jest.spyOn(userRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出しと検証
      await expect(userService.create(userInfo)).rejects.toThrow(UniqueConstraintError); // スローしたエラーの検証
      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数[findById]の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith(userId); // Mockした関数[findById]呼び出し時の引数を検証
      expect(spyCreate).not.toHaveBeenCalled(); // Mockした関数[create]が呼び出されていないことを検証
    });
  });
});