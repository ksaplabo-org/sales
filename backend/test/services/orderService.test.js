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
      ];

      // Mock設定
      const spy = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await orderService.findAll(condition);

      // 実行結果と期待結果が一致することを検証
      expect(actual).toEqual(expected);
      // 検証
      expect(spy).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(condition); // Mockした関数呼び出し時の引数を検証
    });

    describe("delete 受発注情報物理削除", () => {
      test("[正常系] 受発注情報を削除できること", async () => {
        // テストデータ
        const orderNo = "o1000001";

        const order = {
          orderNo: "o1000001",
          confirmedDate: null,
        };

        // Mock設定
        const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

        const deleteSpy = jest.spyOn(orderRepository, "delete").mockResolvedValueOnce();

        // テスト対象関数呼び出し
        await orderService.delete(orderNo);

        // 検証
        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(findSpy).toHaveBeenCalledWith(orderNo);

        expect(deleteSpy).toHaveBeenCalledTimes(1);
        expect(deleteSpy).toHaveBeenCalledWith(orderNo);
      });

      test("[異常系] 対象データが存在しない場合はNotFoundErrorが発生すること", async () => {
        // テストデータ
        const orderNo = "o1000003";

        // Mock設定
        jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);

        // 検証
        await expect(orderService.delete(orderNo)).rejects.toThrow(NotFoundError);
      });

      test("[異常系] 確定日が登録済みの場合はUnprocessableContentErrorが発生すること", async () => {
        // テストデータ
        const orderNo = "o2000001";

        const order = {
          orderNo: "o2000001",
          confirmedDate: "2026-1-3",
        };

        // Mock設定
        jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

        // 検証
        await expect(orderService.delete(orderNo)).rejects.toThrow(UnprocessableContentError);
      });
    });
  });
});
