import { jest } from "@jest/globals";

import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UnprocessableContentError from "../../src/errors/UnprocessableContentError.js";
import orderService from "../../src/services/orderService.js";
import orderRepository from "../../src/repositories/orderRepository.js";

describe("orderService", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 受発注情報一覧取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const condition = { orderNo: "o1000001", orderKbn: "1" };
      // 期待結果
      const expected = [
        {
          orderNo: "o1000001",
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          orderDate: "2026-1-1",
          confirmedDate: "",
          amountTaxIncluded: "20000",
        },
        {
          orderNo: "o2000001",
          orderKbn: "2",
          clientCode: "cc000002",
          productCode: "pc00002",
          orderDate: "2026-1-2",
          confirmedDate: "2026-1-3",
          amountTaxIncluded: "70000",
        },
      ];

      // Mock設定
      const spy = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await orderService.findAll(condition);

      // 検証
      expect(actual).toEqual(expected); // 実行結果と期待結果が一致することを検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(condition); // Mockした関数呼び出し時の引数を検証
    });
  });

  describe("delete 受発注情報物理削除", () => {
    test("[正常系] 受発注情報を削除できること", async () => {
      // 削除条件
      const orderNo = "o1000001";

      // Mock設定
      const order = {
        orderNo: "o1000001",
        confirmedDate: null,
      };
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      const deleteSpy = jest.spyOn(orderRepository, "delete").mockResolvedValueOnce();

      // テスト対象関数呼び出し
      await orderService.delete(orderNo);

      // 受発注情報詳細取得処理が実行されることを検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);

      // 受発注情報削除処理が実行されることを検証
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(orderNo);
    });

    test("[異常系] 対象データが存在しない場合はNotFoundErrorが発生すること", async () => {
      // 削除条件
      const orderNo = "o1000003";

      // Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);

      // テスト対象関数呼び出し・検証
      try {
        await orderService.delete(orderNo);
        fail();
      } catch (error) {
        // NotFoundErrorが発生することを検証
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.field).toBe("orderNo");
        expect(error.message).toBe("この受発注番号は存在しません");
      }

      // Mockした関数の呼び出しを検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
    });

    test("[異常系] 確定日が登録済みの場合はUnprocessableContentErrorが発生すること", async () => {
      // 削除条件
      const orderNo = "o2000001";

      // Mock設定
      const order = {
        orderNo: "o2000001",
        confirmedDate: "2026-1-3",
      };
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      // テスト対象関数呼び出し・検証
      try {
        await orderService.delete(orderNo);
        fail();
      } catch (error) {
        // UnprocessableContentErrorが発生することを検証
        expect(error).toBeInstanceOf(UnprocessableContentError);
        expect(error.field).toBe("orderNo");
        expect(error.message).toBe("この受発注番号は確定日が登録されているため削除できません");
      }

      // Mockした関数の呼び出しを検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
    });
  });
});
