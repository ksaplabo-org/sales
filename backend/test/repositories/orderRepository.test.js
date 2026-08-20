import { jest } from "@jest/globals";
import { Op } from "sequelize";

import orderModel from "../../src/models/orderModel.js";
import orderRepository from "../../src/repositories/orderRepository.js";

describe("orderRepository", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 受発注情報一覧取得", () => {
    // 共通で使用するattributes属性の値
    const attributes = [
      ["order_no", "orderNo"],
      ["order_kbn", "orderKbn"],
      ["client_code", "clientCode"],
      ["product_code", "productCode"],
      ["order_date", "orderDate"],
      ["confirmed_date", "confirmedDate"],
      ["amount_tax_included", "amountTaxIncluded"],
    ];

    // 共通で使用する検索結果
    const results = [
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

    // findAll関数の共通Mock
    let spy;

    // 全テストケース実行前に行う処理
    beforeEach(() => {
      // Mock設定
      spy = jest.spyOn(orderModel, "findAll").mockResolvedValue(results);
    });

    test.each([
      {
        name: "条件なし",
        condition: {},
        where: {},
      },
      {
        name: "受発注番号のみ",
        condition: { orderNo: "o10" },
        where: {
          orderNo: { [Op.like]: "o10%" },
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
        name: "取引先コードのみ",
        condition: { clientCode: "cc000001" },
        where: {
          clientCode: "cc000001",
        },
      },
      {
        name: "商品コードのみ",
        condition: { productCode: "pc00001" },
        where: {
          productCode: "pc00001",
        },
      },
      {
        name: "合計金額（下限と上限）のみ",
        condition: { amountTaxIncludedLow: "10000", amountTaxIncludedHigh: "30000" },
        where: {
          amountTaxIncluded: { [Op.gte]: "10000", [Op.lte]: "30000" },
        },
      },
      {
        name: "合計金額（下限）のみ",
        condition: { amountTaxIncludedLow: "10000" },
        where: {
          amountTaxIncluded: { [Op.gte]: "10000" },
        },
      },
      {
        name: "合計金額（上限）のみ",
        condition: { amountTaxIncludedHigh: "30000" },
        where: {
          amountTaxIncluded: { [Op.lte]: "30000" },
        },
      },
      {
        name: "全条件指定",
        condition: {
          orderNo: "o10",
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          amountTaxIncludedLow: "10000",
          amountTaxIncludedHigh: "30000",
        },
        where: {
          orderNo: { [Op.like]: "o10%" },
          orderKbn: "1",
          clientCode: "cc000001",
          productCode: "pc00001",
          amountTaxIncluded: { [Op.gte]: "10000", [Op.lte]: "30000" },
        },
      },
    ])("[正常系] 検索条件:$name", async ({ condition, where }) => {
      // テスト対象関数の呼び出し
      const actual = await orderRepository.findAll(condition);

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

  describe("findByNo 受発注情報詳細取得", () => {
    // 検索結果
    const result = {
      orderNo: "o1000001",
      orderKbn: "1",
      clientCode: "cc000001",
      productCode: "pc00001",
      orderDate: "2026-1-1",
      confirmedDate: "",
      amountTaxIncluded: "20000",
    };

    let spy;

    beforeEach(() => {
      spy = jest.spyOn(orderModel, "findByPk").mockResolvedValueOnce(result);
    });

    test("[正常系] 受発注番号を指定して取得", async () => {
      // 検索条件
      const orderNo = "o1000001";

      // テスト対象関数の呼び出し
      const actual = await orderRepository.findByNo(orderNo);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(orderNo);
      expect(actual).toEqual(result);
    });
  });

  describe("delete 受発注情報物理削除", () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(orderModel, "destroy").mockResolvedValueOnce(1);
    });

    test("[正常系] 受発注番号を指定して削除", async () => {
      // 削除条件
      const orderNo = "o1000001";

      // テスト対象関数の呼び出し
      await orderRepository.delete(orderNo);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        where: {
          orderNo: orderNo,
        },
      });
    });
  });
});
