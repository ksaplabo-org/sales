import { describe, expect, jest, test } from "@jest/globals";

import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import UnprocessableContentError from "../../src/errors/UnprocessableContentError.js";
import OrderValidationError from "../../src/errors/OrderValidationError.js";
import orderService from "../../src/services/orderService.js";
import orderRepository from "../../src/repositories/orderRepository.js";
import userRepository from "../../src/repositories/userRepository.js";
import clientRepository from "../../src/repositories/clientRepository.js";
import productRepository from "../../src/repositories/productRepository.js";

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
          orderDate: "2026-01-01",
          confirmedDate: "",
          amountTaxIncluded: "20000",
        },
        {
          orderNo: "o2000001",
          orderKbn: "2",
          clientCode: "cc000002",
          productCode: "pc00002",
          orderDate: "2026-01-02",
          confirmedDate: "2026-01-03",
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

  describe("findByNo 受発注情報詳細取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      //検索条件
      const orderNo = "o1000001";

      const order = {
        orderNo: "o1000001",
        updatedId: "u000001",
        dataValues: {},
      };
      const user = {
        lastName: "山田",
        firstName: "哲入",
      };

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      const userSpy = jest.spyOn(userRepository, "findById").mockResolvedValueOnce(user);

      //テスト対象関数呼び出し
      const actual = await orderService.findByNo(orderNo);

      //検証
      expect(actual).toEqual(
        expect.objectContaining({
          updatedId: "u000001",
          dataValues: expect.objectContaining({
            updatedName: "山田 哲入",
          }),
        }),
      );
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
      expect(userSpy).toHaveBeenCalledTimes(1);
      expect(userSpy).toHaveBeenCalledWith(order.updatedId);
    });

    test("[異常系] 対象データが存在しない場合はNotFoundErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o1111111";

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.findByNo(orderNo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.field).toBe("orderNo");
        expect(error.message).toBe("この受発注番号は存在しません");
      }
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
    });
  });

  describe("create 受発注情報登録", () => {
    test("[正常系] 受発注情報を登録できること", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

      // テストデータ
      const orderInfo = {
        orderNo: "o1000001",
        orderKbn: "1",
        clientCode: "cc000001",
        orderDate: "2026-01-01",
        confirmedDate: "",
        shipDate: "",
        deliverDate: "",
        productCode: "pc00001",
        quantity: 10,
      };
      const client = {
        clientCode: "cc000001",
      };
      const product = {
        productCode: "pc00001",
        productPrice: 1000,
      };

      // Mock設定
      const spyFindByNo = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);
      const spyFindClient = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(client);
      const spyFindProduct = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyCreate = jest.spyOn(orderRepository, "create").mockResolvedValueOnce();

      // テスト対象関数呼び出し
      await orderService.create(orderInfo);

      // 検証
      expect(spyFindByNo).toHaveBeenCalledWith(orderInfo.orderNo);
      expect(spyFindClient).toHaveBeenCalledWith(orderInfo.clientCode);
      expect(spyFindProduct).toHaveBeenCalledWith(orderInfo.productCode);
      expect(spyCreate).toHaveBeenCalledTimes(1);

      const createArg = spyCreate.mock.calls[0][0];

      expect(createArg.amount).toBe(10000);
      expect(createArg.tax).toBe(1000);
      expect(createArg.amountTaxIncluded).toBe(11000);

      expect(createArg.createdAt).toBe("2026-01-01T10:00:00.000Z");
      expect(createArg.updatedAt).toBe("2026-01-01T10:00:00.000Z");
      jest.useRealTimers();
    });

    test.each([
      ["1.5の場合は2に四捨五入されること", 15, 15, 2, 17],
      ["1.4の場合は切り上げされず1になること", 14, 14, 1, 15],
    ])("[正常系] 消費税が %s", async (_, productPrice, amount, tax, amountTaxIncluded) => {
      // テストデータ
      const orderInfo = {
        orderNo: "o1000001",
        orderKbn: "1",
        clientCode: "cc000001",
        orderDate: "2026-01-01",
        productCode: "pc00001",
        quantity: 1,
      };
      const client = {
        clientCode: "cc000001",
      };
      const product = {
        productCode: "pc00001",
        productPrice,
      };
      // Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);
      jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(client);
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyCreate = jest.spyOn(orderRepository, "create").mockResolvedValueOnce();

      // テスト対象関数呼び出し
      await orderService.create(orderInfo);

      // 検証
      const createArg = spyCreate.mock.calls[0][0];

      expect(createArg.amount).toBe(amount);
      expect(createArg.tax).toBe(tax);
      expect(createArg.amountTaxIncluded).toBe(amountTaxIncluded);
    });

    test("[異常系] 受発注番号が既に存在する場合はUniqueConstraintErrorが発生すること", async () => {
      const orderInfo = {
        orderNo: "o1000001",
      };

      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce({
        orderNo: "o1000001",
      });

      await expect(orderService.create(orderInfo)).rejects.toThrow(UniqueConstraintError);
    });

    test("[異常系] 取引先コードが存在しない場合はNotFoundErrorが発生すること", async () => {
      const orderInfo = {
        orderNo: "o1000001",
        clientCode: "cc999999",
      };

      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);
      jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      await expect(orderService.create(orderInfo)).rejects.toThrow(NotFoundError);
    });

    test("[異常系] 商品コードが存在しない場合はNotFoundErrorが発生すること", async () => {
      const orderInfo = {
        orderNo: "o1000001",
        clientCode: "cc000001",
        productCode: "pc99999",
      };

      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);
      jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce({
        clientCode: "cc000001",
      });
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      await expect(orderService.create(orderInfo)).rejects.toThrow(NotFoundError);
    });
  });

  describe("update 受発注情報更新", () => {
    test("[正常系] 存在する受発注番号を指定した場合は正常終了すること", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

      //更新条件
      const orderNo = "o1000001";

      const orderInfo = {
        confirmedDate: "2026-01-02",
        shipDate: "2026-01-03",
        deliverDate: "2026-01-04",
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: null,
        shipDate: null,
      };
      const product = {
        productCode: "pc00001",
        productPrice: 1000,
        orderKbn: "1",
      };

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      const productSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const updateSpy = jest.spyOn(orderRepository, "update").mockResolvedValueOnce();

      //テスト対象関数呼び出し
      await orderService.update(orderNo, orderInfo);

      //検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
      expect(productSpy).toHaveBeenCalledTimes(1);
      expect(productSpy).toHaveBeenCalledWith(orderInfo.productCode);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(
        orderNo,
        expect.objectContaining({
          updatedAt: "2026-01-01T10:00:00.000Z",
          productCode: "pc00001",
          quantity: 10,
          amount: 10000,
          tax: 1000,
          amountTaxIncluded: 11000,
        }),
      );
      jest.useRealTimers();
    });

    test.each([
      ["受発注日=確定日=出荷日=納品予定日", "2026-01-01", "2026-01-01", "2026-01-01", "2026-01-01"],
      ["うるう年の2月29日", "2028-02-29", "2028-02-29", "2028-02-29", "2028-02-29"],
    ])("[正常系] %s の場合も更新できること", async (_, orderDate, confirmedDate, shipDate, deliverDate) => {
      //更新条件
      const orderNo = "o1000001";

      const orderInfo = {
        confirmedDate,
        shipDate,
        deliverDate,
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate,
        confirmedDate: null,
        shipDate: null,
      };
      const product = {
        productCode: "pc00001",
        productPrice: 1000,
        orderKbn: "1",
      };

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      const productSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const updateSpy = jest.spyOn(orderRepository, "update").mockResolvedValueOnce();

      //テスト対象関数呼び出し
      await orderService.update(orderNo, orderInfo);

      //検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
      expect(productSpy).toHaveBeenCalledTimes(1);
      expect(productSpy).toHaveBeenCalledWith(orderInfo.productCode);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(
        orderNo,
        expect.objectContaining({
          confirmedDate,
          shipDate,
          deliverDate,
          productCode: "pc00001",
          quantity: 10,
          amount: 10000,
          tax: 1000,
          amountTaxIncluded: 11000,
        }),
      );
    });

    test("[正常系] 発注データが確定日未設定かつ納品予定日設定の場合でも更新できること", async () => {
      //更新条件
      const orderNo = "o2000001";
      const orderInfo = {
        deliverDate: "2026-01-14",
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o2000001",
        orderKbn: "2",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };
      const product = {
        productCode: "pc00001",
        productPrice: 1000,
        orderKbn: "2",
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const updateSpy = jest.spyOn(orderRepository, "update").mockResolvedValueOnce();

      //テスト対象関数呼び出し
      await orderService.update(orderNo, orderInfo);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(
        orderNo,
        expect.objectContaining({
          deliverDate: "2026-01-14",
          productCode: "pc00001",
          quantity: 10,
          amount: 10000,
          tax: 1000,
          amountTaxIncluded: 11000,
        }),
      );
    });

    test("[異常系] 対象データが存在しない場合はNotFoundErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o1111111";
      const orderInfo = {
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(null);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.field).toBe("orderNo");
        expect(error.message).toBe("この受発注番号は存在しません");
      }
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
    });

    test("[異常系] 確定済みデータに確定日を入力した場合はOrderValidationErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o1000001";
      const orderInfo = {
        confirmedDate: "2026-01-12",
        shipDate: "2026-01-13",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: "2026-01-02",
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "confirmedDate",
            message: "確定日は入力できません",
          },
        ]);
      }
    });

    test("[異常系] 発注データに出荷日を入力した場合はOrderValidationErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o2000001";
      const orderInfo = {
        shipDate: "2026-02-03",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o2000001",
        orderKbn: "2",
        orderDate: "2026-02-01",
        confirmedDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "shipDate",
            message: "出荷日は入力できません",
          },
        ]);
      }
    });

    test("[異常系] 受注データで出荷日未入力の場合はOrderValidationErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o1000001";
      const orderInfo = {
        shipDate: null,
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "shipDate",
            message: "出荷日を入力してください",
          },
        ]);
      }
    });

    test.each([
      ["確定日", "confirmedDate", "2026/01/02", "日付はyyyy-MM-ddの形式で入力してください"],
      ["出荷日", "shipDate", "2026/01/03", "日付はyyyy-MM-ddの形式で入力してください"],
      ["納品予定日", "deliverDate", "2026/01/04", "日付はyyyy-MM-ddの形式で入力してください"],
    ])("[異常系] %s の日付形式が不正の場合はOrderValidationErrorが発生すること", async (_, field, value, message) => {
      //更新条件
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: null,
        shipDate: "2026-01-03",
      };
      const orderInfo = {
        confirmedDate: null,
        shipDate: "2026-01-03",
        deliverDate: "2026-01-04",
        productCode: "pc00001",
        quantity: 10,
      };
      orderInfo[field] = value;

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(order.orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error.errors).toContainEqual({
          field,
          message,
        });
      }
    });

    test.each([
      ["確定日", "confirmedDate", "2026-09-31", "正しい日付を入力してください"],
      ["出荷日", "shipDate", "2026-09-31", "正しい日付を入力してください"],
      ["納品予定日", "deliverDate", "2026-09-31", "正しい日付を入力してください"],
    ])("[異常系] %sが存在しない日付の場合はOrderValidationErrorが発生すること", async (_, field, value, message) => {
      //更新条件
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: null,
        shipDate: "2026-01-03",
      };
      const orderInfo = {
        confirmedDate: null,
        shipDate: "2026-01-03",
        deliverDate: "2026-01-04",
        productCode: "pc00001",
        quantity: 10,
      };
      orderInfo[field] = value;

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(order.orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toContainEqual({
          field,
          message,
        });
      }
    });

    test("[異常系] 確定日が受発注日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o1000001";
      const orderInfo = {
        confirmedDate: "2026-01-09",
        shipDate: "2026-01-13",
        deliverDate: "2026-01-14",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "confirmedDate",
            message: "確定日は受発注日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 出荷日が受注日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o1000001";
      const orderInfo = {
        shipDate: "2026-01-09",
        deliverDate: "2026-01-14",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "shipDate",
            message: "出荷日は受注日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 出荷日が入金日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o1000001";
      const orderInfo = {
        confirmedDate: "2026-01-12",
        shipDate: "2026-01-11",
        deliverDate: "2026-01-14",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "shipDate",
            message: "出荷日は入金日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 納品予定日が受発注日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o2000001";
      const orderInfo = {
        deliverDate: "2026-01-09",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o2000001",
        orderKbn: "2",
        orderDate: "2026-01-10",
        confirmedDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "deliverDate",
            message: "納品予定日は受発注日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 納品予定日が確定日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o2000001";
      const orderInfo = {
        deliverDate: "2026-01-12",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o2000001",
        orderKbn: "2",
        orderDate: "2026-01-10",
        confirmedDate: "2026-01-13",
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "deliverDate",
            message: "納品予定日は確定日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 受注データで納品予定日が出荷日より前の場合はOrderValidationErrorが発生すること", async () => {
      //検索条件
      const orderNo = "o1000001";
      const orderInfo = {
        shipDate: "2026-01-13",
        deliverDate: "2026-01-12",
        productCode: "pc00001",
        quantity: 10,
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(OrderValidationError);
        expect(error.errors).toEqual([
          {
            field: "deliverDate",
            message: "納品予定日は出荷日以降の日付を入力してください",
          },
        ]);
      }
    });

    test("[異常系] 複数の相関チェックエラーが発生した場合はすべてのエラー情報が設定されること", async () => {
      //検索条件
      const orderInfo = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-04",
        confirmedDate: "2026-01-03",
        shipDate: "2026-01-02",
        deliverDate: "2026-01-01",
      };

      await expect(orderService.update("o1000001", orderInfo)).rejects.toMatchObject({
        errors: [
          {
            field: "confirmedDate",
            message: "確定日は受発注日以降の日付を入力してください",
          },
          {
            field: "shipDate",
            message: "出荷日は受注日以降の日付を入力してください",
          },
          {
            field: "deliverDate",
            message: "納品予定日は受発注日以降の日付を入力してください",
          },
        ],
      });
    });

    test("[異常系] 商品コードが存在しない場合はNotFoundErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o1000001";
      const orderInfo = {
        shipDate: "2026-01-03",
        deliverDate: null,
        productCode: "pc11111",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-01",
        confirmedDate: null,
        shipDate: "2026-01-03",
      };

      //Mock設定
      const findSpy = jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      const productSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.field).toBe("productCode");
        expect(error.message).toBe("この商品コードは存在しません");
      }
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(orderNo);
      expect(productSpy).toHaveBeenCalledTimes(1);
      expect(productSpy).toHaveBeenCalledWith(orderInfo.productCode);
    });

    test("[異常系] 商品の受発注区分が一致しない場合はNotFoundErrorが発生すること", async () => {
      //更新条件
      const orderNo = "o1000001";
      const orderInfo = {
        shipDate: "2026-01-13",
        deliverDate: "2026-01-14",
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "1",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: "null",
      };
      const product = {
        productCode: "pc00001",
        productPrice: 1000,
        orderKbn: "2",
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);

      //テスト対象関数呼び出し・検証
      await expect(orderService.update(orderNo, orderInfo)).rejects.toBeInstanceOf(NotFoundError);
    });

    // Coverage用：受発注区分が想定外の値の場合の分岐を通過させる
    test("[異常系] 受発注区分が1,2以外の場合でも商品コード存在チェックが実行されること", async () => {
      //編集条件
      const orderNo = "o1000001";
      const orderInfo = {
        productCode: "pc00001",
        quantity: 10,
        updatedId: "u00001",
      };
      const order = {
        orderNo: "o1000001",
        orderKbn: "3",
        orderDate: "2026-01-10",
        confirmedDate: null,
        shipDate: null,
      };

      //Mock設定
      jest.spyOn(orderRepository, "findByNo").mockResolvedValueOnce(order);
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

      //テスト対象関数呼び出し・検証
      try {
        await orderService.update(orderNo, orderInfo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.field).toBe("productCode");
      }
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
        confirmedDate: "2026-01-03",
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
