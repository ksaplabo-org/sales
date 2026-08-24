import { expect, jest } from "@jest/globals";
import orderRepository from "../../src/repositories/orderRepository.js";
import clientService from "../../src/services/clientService.js";
import clientRepository from "../../src/repositories/clientRepository.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";
import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";

describe("clientService", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 取引先情報一覧取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const condition = { clientCode: "test000", clientName: "テスト" };

      // 期待結果
      const expectedResult = [
        { clientCode: "test0001", clientName: "Aテスト会社", orderKbn: "1" },
        { clientCode: "test0002", clientName: "Bテスト商事", orderKbn: "1" },
      ];

      // Mock設定
      const spy = jest.spyOn(clientRepository, "findAll").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      const actual = await clientService.findAll(condition);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(condition); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expectedResult); // 実行結果と期待結果が一致することを検証
    });
  });

  describe("findByCode 取引先情報詳細取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const clientCode = "test0001";

      // 期待結果
      const expectedResult = {
        clientCode: "test0001",
        clientName: "Aテスト会社",
        orderKbn: "1",
        postCode: "1234567",
        address1: "A県B市C区中央南1条西1丁目13番地",
        address2: "ABCビル3階",
        telNumber: "333-4444-4444",
      };

      // Mock設定
      const spy = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      const actual = await clientService.findByCode(clientCode);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(actual).toEqual(expectedResult); // 実行結果と期待結果が一致することを検証
    });

    test("[異常系] 存在しない取引先コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const clientCode = "test1000";

      // Mock設定
      const spy = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);

      try {
        // テスト対象関数の呼び出し
        await clientService.findByCode(clientCode);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError); // スローしたエラーの検証
        expect(error.field).toBe("clientCode"); // エラーフィールドを検証
        expect(error.message).toBe("この取引先情報は存在しません"); // エラーメッセージを検証
      }
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("create 取引先情報登録", () => {
    test("[正常系] 存在しない取引先コードを指定した場合 => 正常終了すること", async () => {
      const clientCode = "a0000003";

      const clientInfo = {
        clientCode: clientCode,
        clientName: "C商社",
        orderKbn: "2",
        createdAt: "2026-08-14 17:17:26",
        updatedAt: "2026-08-14 17:17:26",
      };

      // Mock設定
      const spyFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(clientRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await clientService.create(clientInfo);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyCreate).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyCreate).toHaveBeenCalledWith(clientInfo); // Mockした関数呼び出し時の引数を検証
      expect(clientInfo.createdAt).toBe(new Date(clientInfo.createdAt).toISOString());
      expect(clientInfo.updatedAt).toBe(new Date(clientInfo.updatedAt).toISOString());
    });

    test("[異常系] 存在する取引先コードを指定した場合 => UniqueConstraintErrorとなること", async () => {
      const clientCode = "a0000001";

      const clientInfo = { clientCode: "a0000001", clientName: "C商社", orderKbn: "2" };

      // Mock設定
      const spyFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(clientInfo);
      const spyCreate = jest.spyOn(clientRepository, "create").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await clientService.create(clientInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueConstraintError); // スローしたエラーの検証
        expect(error.field).toBe("clientCode"); // エラーフィールドを検証
        expect(error.message).toBe("この取引先コードは既に使用されています"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyCreate).not.toHaveBeenCalled(); // Mockした関数が呼び出されていないことを検証
    });
  });

  describe("update 取引先情報更新", () => {
    test("[正常系] 存在する取引先コードを指定した場合 => 正常終了すること", async () => {
      // 検索条件
      const clientCode = "a0000001";

      // 更新に送る情報
      const clientInfo = { clientName: "A株式会社更新", orderKbn: "2", updatedAt: "2026-08-14 17:17:26" };

      // DBに存在するデータ
      const client = {
        clientCode: "a0000001",
        clientName: "A株式会社",
        orderKbn: "1",
        updatedAt: "2026-08-01 20:19:01",
      };

      // Mock設定
      const spyFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(client);
      const spyUpdate = jest.spyOn(clientRepository, "update").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await clientService.update(clientCode, clientInfo);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode);
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(
        clientCode,
        expect.objectContaining({
          clientName: "A株式会社更新",
          orderKbn: "2",
        }),
      );
      expect(clientInfo.updatedAt).toBe(new Date(clientInfo.updatedAt).toISOString());
    });

    test("[異常系] 存在しない取引先コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const clientCode = "a0009999";

      const clientInfo = { clientName: "A株式会社更新", orderKbn: "2" };

      // Mock設定
      const spyFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      const spyUpdate = jest.spyOn(clientRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await clientService.update(clientCode);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError); // スローしたエラーの検証
        expect(error.field).toBe("clientCode"); // エラーフィールドを検証
        expect(error.message).toBe("この取引先情報は存在しません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyUpdate).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
    });
  });

  describe("delete 取引先情報削除", () => {
    test("[正常系] 取引先削除処理を呼び出した結果が正常終了（エラースローされない）", async () => {
      // 検索条件
      const clientCode = "test0011";

      // 前提条件
      const clients = [];

      // 期待結果
      const expectedResult = undefined;

      // Mock設定
      const spyFindByCode = jest
        .spyOn(clientRepository, "findByCode")
        .mockResolvedValueOnce({ clientCode: "test0011" });
      const spyFindAll = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce(clients);
      const spyDelete = jest.spyOn(clientRepository, "delete").mockResolvedValueOnce(expectedResult);

      // テスト対象関数の呼び出し
      await clientService.delete(clientCode);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyFindAll).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindAll).toHaveBeenCalledWith({ clientCode: clientCode }); // Mockした関数呼び出し時の引数を検証
      expect(spyDelete).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
    });

    test("[異常系] 存在しない取引先コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const clientCode = "test1000";

      // 前提条件
      const clients = [{ clientCode: "test0001" }];

      // Mock設定
      const spyFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      const spyFindAll = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce(clients);
      const spyDelete = jest.spyOn(clientRepository, "delete").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await clientService.delete(clientCode);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError); // スローしたエラーの検証
        expect(error.field).toBe("clientCode"); // エラーフィールドを検証
        expect(error.message).toBe("この取引先情報は存在しません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyFindAll).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
    });

    test("[異常系] 受発注情報に取引先コードが使用されている場合 => ReferenceConstraintErrorとなること", async () => {
      // 検索条件
      const clientCode = "test0001";

      // 前提条件
      const clients = [{ clientCode: "test0001" }];

      // Mock設定
      const spyFindByCode = jest
        .spyOn(clientRepository, "findByCode")
        .mockResolvedValueOnce({ clientCode: "test0001" });
      const spyFindAll = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce(clients);
      const spyDelete = jest.spyOn(clientRepository, "delete").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await clientService.delete(clientCode);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceConstraintError); // スローしたエラーの検証
        expect(error.field).toBe("clientCode"); // エラーフィールドを検証
        expect(error.message).toBe("取引先コードが受発注情報で使用されているため削除できません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(clientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyFindAll).toHaveBeenCalledWith({ clientCode: clientCode }); //Mockした関数呼び出し時の引数の検証
      expect(spyFindAll).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
    });
  });
});
