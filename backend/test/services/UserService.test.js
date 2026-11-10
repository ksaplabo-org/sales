import { jest } from "@jest/globals";

import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import ForbiddenError from "../../src/errors/ForbiddenError.js";
import userService from "../../src/services/UserService.js";
import userRepository from "../../src/repositories/userRepository.js";

// 全テストケース実行後に行う処理
afterEach(() => {
  // Mockをすべて初期化
  jest.resetAllMocks();
});

describe("UserService", () => {
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
      const loginId = "a0b001";
      const loginRole = "2";
      // 期待結果
      const expected = { userId: "a0b001", lastName: "テスト", firstName: "太郎", delFlg: false };

      // Mock設定
      const spy = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await userService.findById(userId, loginId, loginRole);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith("a0b001"); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expected); // 実行結果と期待結果が一致することを検証
    });

    test("[異常系] 存在しないユーザーIDを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const userId = "a0b001";
      const loginId = "a0b001";
      const loginRole = "2";

      // Mock設定
      const spy = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      // テスト対象関数の呼び出しと検証
      await expect(userService.findById(userId, loginId, loginRole)).rejects.toThrow(NotFoundError); // スローしたエラーの検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith("a0b001"); // Mockした関数呼び出し時の引数を検証
    });

    test("[異常系] 取得したユーザー情報が論理削除されている場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const userId = "a0b001";
      const loginId = "a0b001";
      const loginRole = "2";

      // Mock設定
      const spy = jest
        .spyOn(userRepository, "findById")
        .mockResolvedValueOnce({ userId: "a0b001", lastName: "テスト", firstName: "太郎", delFlg: true });

      // テスト対象関数の呼び出しと検証
      await expect(userService.findById(userId, loginId, loginRole)).rejects.toThrow(NotFoundError); // スローしたエラーの検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith("a0b001"); // Mockした関数呼び出し時の引数を検証
    });

    test("[正常系] ログインユーザー権限が管理者かつログインユーザーIDと取得対象のユーザーIDが一致していない場合 => ユーザー情報が返却されること", async () => {
      // 検索条件
      const userId = "test02";
      const loginId = "test01";
      const loginRole = "2";

      // 期待結果
      const expectedResult = { userId: "test02", lastName: "テスト", firstName: "次郎", delFlg: false };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(expectedResult);

      // テスト対象の関数の呼び出し
      const actual = await userService.findById(userId, loginId, loginRole);

      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith("test02"); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expectedResult); // 実行結果と期待結果が一致することを検証
    });


    test("[正常系] ログインユーザー権限が一般かつログインユーザーIDと取得対象のユーザーIDが一致した場合 => ユーザー情報が返却されること", async () => {
      // 検索条件
      const userId = "test03";
      const loginId = "test03";
      const loginRole = "1";

      // 期待結果
      const expectedResult = { userId: "test03", lastName: "テスト", firstName: "花子", delFlg: false };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(expectedResult);

      // テスト対象の関数の呼び出し
      const actual = await userService.findById(userId, loginId, loginRole);

      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith("test03"); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expectedResult); // 実行結果と期待結果が一致することを検証
    });

    test("[異常系] ログインユーザー権限が一般かつログインユーザーIDと取得対象のユーザーIDが一致しない場合 => ForbiddenErrorとなること", async () => {
      // 検索条件
      const userId = "test04";
      const loginId = "test03";
      const loginRole = "1";

      // 期待結果
      const expectedResult = { userId: "test04", lastName: "テスト", firstName: "良子", delFlg: false };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出しと検証
      await expect(userService.findById(userId, loginId, loginRole)).rejects.toThrow(ForbiddenError); // スローしたエラーの検証
      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith("test04"); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("create ユーザー情報登録", () => {
    test("[正常系] 存在しないユーザーIDを指定した場合 => 正常終了すること", async () => {
      // 検索条件
      const userInfo = { userId: "test01", firstName: "テスト", lastName: "一郎" };
      const loginId = "test01";

      // 現在日時をMock
      const mockDate = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(userRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await userService.create(userInfo, loginId);

      // 検証
      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数[findById]の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith("test01"); // Mockした関数[findById]呼び出し時の引数を検証
      expect(spyCreate).toHaveBeenCalledTimes(1); // Mockした関数[create]の呼び出し回数を検証
      expect(spyCreate).toHaveBeenCalledWith({
        // Mockした関数[create]呼び出し時の引数を検証
        userId: "test01",
        firstName: "テスト",
        lastName: "一郎",
        createdId: "test01",
        updatedId: "test01",
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      });
      jest.useRealTimers();
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

  describe("update ユーザー情報更新", () => {
        test("[正常系] ログインユーザー権限が管理者かつログインユーザーIDと更新対象のユーザーIDが一致した場合 => 正常終了すること", async () => {
      // 検索条件
      const userId = "test01";
      const userInfo = { firstName: "テスト", lastName: "一郎" };
      const loginId = "test01";
      const loginRole = "2";

      // 現在日時をMock
      const mockDate = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // DBに存在するデータ
      const user = {
        userId: "test01",
        firstName: "テスト",
        lastName: "二郎",
        orderKbn: "2",
      };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(user);
      const spyUpdate = jest.spyOn(userRepository, "update").mockResolvedValueOnce();

      await userService.update(userId, userInfo, loginId, loginRole);

      // update内のユーザー詳細取得呼び出しの検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith("test01");
      // テスト対象の関数呼び出し検証
      expect(spyUpdate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyUpdate).toHaveBeenCalledWith("test01", {
        // Mockした関数呼び出し時の引数を検証
        firstName: "テスト",
        lastName: "一郎",
        updatedId: "test01",
        updatedAt: mockDate.toISOString(),
      });
      jest.useRealTimers();
    });
    
            test("[正常系] ログインユーザー権限が管理者かつログインユーザーIDと更新対象のユーザーIDが一致しない場合 => 正常終了すること", async () => {
      // 検索条件
      const userId = "test02";
      const userInfo = { firstName: "テスト", lastName: "二郎" };
      const loginId = "test01";
      const loginRole = "2";

      // 現在日時をMock
      const mockDate = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // DBに存在するデータ
      const user = {
        userId: "test02",
        firstName: "テスト",
        lastName: "一郎",
        orderKbn: "2",
      };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(user);
      const spyUpdate = jest.spyOn(userRepository, "update").mockResolvedValueOnce();

      await userService.update(userId, userInfo, loginId, loginRole);

      // update内のユーザー詳細取得呼び出しの検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith("test02");
      // テスト対象の関数呼び出し検証
      expect(spyUpdate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyUpdate).toHaveBeenCalledWith("test02", {
        // Mockした関数呼び出し時の引数を検証
        firstName: "テスト",
        lastName: "二郎",
        updatedId: "test01",
        updatedAt: mockDate.toISOString(),
      });
      jest.useRealTimers();
    });

    test("[正常系] ログインユーザー権限が一般かつログインユーザーIDと更新対象のユーザーIDが一致した場合 => 正常終了すること", async () => {
      // 検索条件
      const userId = "test03";
      const userInfo = { firstName: "テスト", lastName: "良子" };
      const loginId = "test03";
      const loginRole = "1";

      // 現在日時をMock
      const mockDate = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // DBに存在するデータ
      const user = {
        userId: "test03",
        firstName: "テスト",
        lastName: "三子",
        orderKbn: "1",
      };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(user);
      const spyUpdate = jest.spyOn(userRepository, "update").mockResolvedValueOnce();

      await userService.update(userId, userInfo, loginId, loginRole);

      // update内のユーザー詳細取得呼び出しの検証
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith("test03");
      // テスト対象の関数呼び出し検証
      expect(spyUpdate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyUpdate).toHaveBeenCalledWith("test03", {
        // Mockした関数呼び出し時の引数を検証
        firstName: "テスト",
        lastName: "良子",
        updatedId: "test03",
        updatedAt: mockDate.toISOString(),
      });
      jest.useRealTimers();
    });

    test("[異常系] ログインユーザー権限が一般かつログインユーザーIDと取得対象のユーザーIDが一致しない場合 => ForbiddenErrorとなること", async () => {
      // 検索条件
      const userId = "test04";
      const userInfo = { firstName: "テスト", lastName: "良子" };
      const loginId = "test03";
      const loginRole = "1";

      // DBに存在するデータ
      const user = {
        userId: "test04",
        firstName: "テスト",
        lastName: "四子",
        orderKbn: "1",
      };

      // Mock設定
      const spyFindById = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(user);
      const spyUpdate = jest.spyOn(userRepository, "update").mockResolvedValueOnce();

      // テスト対象関数の呼び出しと検証
      await expect(userService.update(userId, userInfo, loginId, loginRole)).rejects.toThrow(ForbiddenError); // スローしたエラーの検証
      expect(spyFindById).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindById).toHaveBeenCalledWith("test04"); // Mockした関数が呼び出されていないことを検証
      expect(spyUpdate).not.toHaveBeenCalled(); // Mockした関数が呼び出されていないことを検証
    });
  });
});
