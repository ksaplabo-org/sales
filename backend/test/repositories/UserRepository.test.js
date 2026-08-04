import { jest } from "@jest/globals";
import { col, fn, literal, Op } from "sequelize";

import UserModel from "../../src/models/UserModel.js";
import userRepository from "../../src/repositories/UserRepository.js";

describe("UserRepository", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll ユーザー情報一覧取得", () => {
    // 共通で使用するattributes属性の値
    const attributes = [
      "userId",
      "lastName",
      "firstName",
      [fn("CONCAT", col("last_name"), " ", col("first_name")), "fullName"],
      "role",
      "birthday",
      [literal("TIMESTAMPDIFF(YEAR, birthday, CURDATE())"), "age"],
      "delFlg",
    ];

    // 共通で使用する検索結果
    const results = [
      { userId: "a0b001", lastName: "テスト", firstName: "太郎" },
      { userId: "a0b002", lastName: "テスト", firstName: "次郎" },
    ];

    // findAll関数の共通Mock
    let spy;

    // 全テストケース実行前に行う処理
    beforeEach(() => {
      // Mock設定
      spy = jest.spyOn(UserModel, "findAll").mockResolvedValueOnce(results);
    });

    test("[正常系] 検索条件:ユーザーIDのみ", async () => {
      // 検索条件
      const condition = { userId: "a0b00" };

      // テスト対象関数の呼び出し
      const actual = await userRepository.findAll(condition);

      // 検証
      const expectedArg = {
        attributes: attributes,
        where: {
          userId: { [Op.like]: "%a0b00%" },
          delFlg: false,
        },
      };
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(results); // 実行結果と期待結果が一致することを検証
    });

    test("[正常系] 検索条件:ユーザー名のみ", async () => {
      // 検索条件
      const condition = { userName: "テスト" };

      // テスト対象関数の呼び出し
      const actual = await userRepository.findAll(condition);

      // 検証
      const expectedArg = {
        attributes: attributes,
        where: {
          [Op.or]: [{ lastName: { [Op.like]: "%テスト%" } }, { firstName: { [Op.like]: "%テスト%" } }],
          delFlg: false,
        },
      };
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(results); // 実行結果と期待結果が一致することを検証
    });

    test("[正常系] 検索条件:権限のみ", async () => {
      // 検索条件
      const condition = { role: "1" };

      // テスト対象関数の呼び出し
      const actual = await userRepository.findAll(condition);

      // 検証
      const expectedArg = {
        attributes: attributes,
        where: {
          role: "1",
          delFlg: false,
        },
      };
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(results); // 実行結果と期待結果が一致することを検証
    });
    test.each([
      {
        name: "条件なし",
        condition: {},
        where: { delFlg: false },
      },
      {
        name: "ユーザーIDのみ",
        condition: { userId: "a0b00" },
        where: {
          userId: { [Op.like]: "%a0b00%" },
          delFlg: false,
        },
      },
      {
        name: "ユーザー名のみ",
        condition: { userName: "テスト" },
        where: {
          [Op.or]: [{ lastName: { [Op.like]: "%テスト%" } }, { firstName: { [Op.like]: "%テスト%" } }],
          delFlg: false,
        },
      },
      {
        name: "権限のみ",
        condition: { role: "1" },
        where: {
          role: "1",
          delFlg: false,
        },
      },
      {
        name: "論理削除を含める(false)のみ",
        condition: { includeDeleted: false },
        where: { delFlg: false },
      },
      {
        name: "論理削除を含める(true)のみ",
        condition: { includeDeleted: true },
        where: {},
      },
      {
        name: "すべての条件を指定",
        condition: { userId: "a0b00", userName: "テスト", role: "1", includeDeleted: true },
        where: {
          userId: { [Op.like]: "%a0b00%" },
          [Op.or]: [{ lastName: { [Op.like]: "%テスト%" } }, { firstName: { [Op.like]: "%テスト%" } }],
          role: "1",
        },
      },
    ])("[正常系] 検索条件:$name", async ({ condition, where }) => {
      // テスト対象関数の呼び出し
      const actual = await userRepository.findAll(condition);

      // 検証
      const expectedArg = {
        attributes: attributes,
        where: where,
      };
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(results); // 実行結果と期待結果が一致することを検証
    });
  });
});
