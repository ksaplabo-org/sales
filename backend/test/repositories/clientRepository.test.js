import { jest } from "@jest/globals";
import { col, fn, literal, Op } from "sequelize";

import clientModel from "../../src/models/clientModel.js";
import clientRepository from "../../src/repositories/clientRepository.js";

describe("clientRepository", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 取引先情報一覧取得", () => {
    // 共通で使用するattributes属性の値
    const attributes = [
      ["client_code", "clientCode"],
      ["order_kbn", "orderKbn"],
      ["client_name", "clientName"],
      ["post_code", "postCode"],
      ["address1", "address1"],
      ["address2", "address2"],
      [fn("CONCAT", col("address1"), col("address2")), "fullAddress"],
      ["tel_number", "telNumber"],
      [literal("EXISTS(SELECT 1 FROM orders o WHERE o.client_code = clientModel.client_code)"), "usedFlg"],
    ];

    // 共通で使用する検索結果
    const results = [
      { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" },
      { clientCode: "test0002", clientName: "Bテスト商事", orderKbn: "1" },
    ];

    test.each([
      {
        name: "条件なし",
        condition: {},
        where: {},
      },
      {
        name: "取引先コードのみ",
        condition: { clientCode: "test" },
        where: {
          clientCode: { [Op.like]: "%test%" },
        },
      },
      {
        name: "取引先名のみ",
        condition: { clientName: "テスト" },
        where: {
          clientName: { [Op.like]: "%テスト%" },
        },
      },
      {
        name: "受発注区分のみ",
        condition: { orderKbn: "1" },
        where: {
          orderKbn: "1",
        },
      },
      {
        name: "取引先コードと取引先名のみ",
        condition: { clientCode: "test", clientName: "テスト" },
        where: {
          clientCode: { [Op.like]: "%test%" },
          clientName: { [Op.like]: "%テスト%" },
        },
      },
      {
        name: "取引先名と受発注区分のみ",
        condition: { clientName: "テスト", orderKbn: "1" },
        where: {
          clientName: { [Op.like]: "%テスト%" },
          orderKbn: "1",
        },
      },
      {
        name: "取引先コードと受発注区分のみ",
        condition: { clientCode: "test", orderKbn: "1" },
        where: {
          clientCode: { [Op.like]: "%test%" },
          orderKbn: "1",
        },
      },
      {
        name: "すべての条件を指定",
        condition: { clientCode: "test", clientName: "テスト", orderKbn: "1" },
        where: {
          clientCode: { [Op.like]: "%test%" },
          clientName: { [Op.like]: "%テスト%" },
          orderKbn: "1",
        },
      },
    ])("[正常系] 検索条件:$name", async ({ condition, where }) => {
      // Mock設定
      const spy = jest.spyOn(clientModel, "findAll").mockResolvedValueOnce(results);

      // テスト対象関数の呼び出し
      const actual = await clientRepository.findAll(condition);

      // 期待する引数
      const expectedArg = {
        attributes: attributes,
        where: where,
      };

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(expectedArg); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(results); // 実行結果と期待結果が一致することを検証
    });
  });

  describe("findByCode 取引先情報詳細取得", () => {
    test("[正常系] 取引先情報取得", async () => {
      // 検索条件
      const clientCode = "test0001";

      // 取得結果
      const result = { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" };

      // Mock設定
      const spy = jest.spyOn(clientModel, "findByPk").mockResolvedValueOnce(result);

      // テスト対象関数実行
      const actual = await clientRepository.findByCode(clientCode);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // 呼び出し回数の検証
      expect(spy).toHaveBeenCalledWith(clientCode); // 引数の検証
      expect(actual).toEqual(result); // 実行結果と期待結果が一致するかの検証
    });
  });

  describe("create 取引先情報登録", () => {
    test("[正常系] 取引先情報登録", async () => {
      const clientInfo = { clientCode: "test0003", clientName: "Aテスト会社", orderKbn: "1" };

      const spy = jest.spyOn(clientModel, "create").mockResolvedValueOnce(clientInfo);

      await clientRepository.create(clientInfo);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(clientInfo);
    });
  });

  describe("update 取引先情報更新", () => {
    test("[正常系] 取引先情報更新", async () => {
      const clientCode = "test0001";

      const clientInfo = { clientName: "Aテスト商社", orderKbn: "2" };

      const spy = jest.spyOn(clientModel, "update").mockResolvedValueOnce([1]);

      await clientRepository.update(clientCode, clientInfo);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(clientInfo, {
        where: {
          clientCode: clientCode,
        },
      });
    });
  });

  describe("delete 取引先情報削除", () => {
    test("[正常系] 取引先情報削除", async () => {
      // 検索条件
      const clientCode = "test0011";

      // 期待動作
      const expectedResult = undefined;

      // Mock設定
      const spy = jest.spyOn(clientModel, "destroy").mockResolvedValueOnce(expectedResult);

      // テスト対象実行
      const actual = await clientRepository.delete(clientCode);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // 呼び出し回数の検証
      expect(spy).toHaveBeenCalledWith({
        // 引数の検証
        where: {
          clientCode: clientCode,
        },
      });
      expect(actual).toEqual(expectedResult); // 実行結果と期待結果が一致するかの検証
    });
  });
});
