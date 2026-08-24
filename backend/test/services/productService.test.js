import { jest } from "@jest/globals";

import UniqueConstraintError from "../../src/errors/UniqueConstraintError.js";
import NotFoundError from "../../src/errors/NotFoundError.js";
import ValidationError from "../../src/errors/ValidationError.js";
import ReferenceConstraintError from "../../src/errors/ReferenceConstraintError.js";
import productService from "../../src/services/productService.js";
import productRepository from "../../src/repositories/productRepository.js";
import clientRepository from "../../src/repositories/clientRepository.js";
import orderRepository from "../../src/repositories/orderRepository.js";

describe("productService", () => {
  // 全テストケース実行後に行う処理
  afterEach(() => {
    // Mockをすべて初期化
    jest.clearAllMocks();
  });

  describe("findAll 商品情報一覧取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const condition = { productCode: "a0b001", productName: "テスト" };

      // 期待結果
      const expected = [{ productCode: "a0b001", productName: "テスト" }];

      // Mock設定
      const spy = jest.spyOn(productRepository, "findAll").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await productService.findAll(condition);

      // 実行結果と期待結果が一致することを検証
      expect(actual).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(condition);
    });
  });

  describe("findByCode 商品情報詳細取得", () => {
    test("[正常系] 存在する商品コードを指定した場合 => 商品情報が返却されること", async () => {
      // 検索条件
      const productCode = "a0b001";

      // 期待結果
      const expected = { productCode: "a0b001", productName: "テスト" };

      // Mock設定
      const spy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await productService.findByCode(productCode);

      // 検証
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(productCode);
      expect(actual).toEqual(expected);
    });

    test("[異常系] 存在しない商品コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const productCode = "a0b999";

      // Mock設定
      const spy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

      //テスト対象・検証
      try {
        //テスト関数呼び出し
        await productService.findByCode(productCode);
        //エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError); //スローしたエラーの情報
        expect(e.field).toBe("productCode"); //エラーフィールドを検証
        expect(e.message).toBe("この商品コードは存在していません"); //エラーメッセージを検証
      }
      expect(spy).toHaveBeenCalledTimes(1); //Mockした関数の呼び出し回数を検証
      expect(spy).toHaveBeenCalledWith(productCode); //Mockした関数呼び出し時の引数を検証
    });
  });

  describe("create 商品情報登録", () => {
    test("[正常系] 受発注区分=2の場合かつ取引先コードが存在する場合 => 登録できること", async () => {
      // 登録情報
      const productInfo = {
        productCode: "a0b001",
        productName: "テスト商品",
        orderKbn: "2",
        orderClientCode: "c0000001",
        productPrice: 1000,
      };

      const clientFindSpy = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce({
        clientCode: "c0000001",
      });

      // Mock設定
      const findSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const createSpy = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象
      await productService.create(productInfo);

      // 検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(productInfo.productCode);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(clientFindSpy).toHaveBeenCalledTimes(1);
      expect(clientFindSpy).toHaveBeenCalledWith("c0000001");
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          productCode: "a0b001",
          productName: "テスト商品",
          orderClientCode: "c0000001",
          productPrice: 1000,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    test("[正常系] 受発注区分=1の場合 => 登録できること", async () => {
      // 登録情報
      const productInfo = {
        productCode: "a0b001",
        productName: "テスト商品",
        orderKbn: "1",
        productPrice: 1000,
      };

      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

      // Mock設定
      const createSpy = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象
      await productService.create(productInfo);

      // 検証
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    test("[異常系] 既に存在する商品コードを指定した場合 => UniqueConstraintErrorとなること", async () => {
      // 登録情報
      const productInfo = {
        productCode: "a0b001",
        productName: "テスト商品",
      };

      // Mock設定
      const findSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        productCode: "a0b001",
      });

      const createSpy = jest.spyOn(productRepository, "create");

      // テスト対象・検証
      try {
        await productService.create(productInfo);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(UniqueConstraintError);
        expect(e.field).toBe("productCode");
        expect(e.message).toBe("この商品コードは既に登録されているため登録できません");
      }
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(productInfo.productCode);

      // createは呼ばれない
      expect(createSpy).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=2かつ存在しない発注先コードの場合 => NotFoundErrorになること", async () => {
      const productInfo = {
        productCode: "a0b001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

      jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);

      await expect(productService.create(productInfo)).rejects.toThrow(NotFoundError);
    });
  });

  describe("update 商品情報更新", () => {
    test("[正常系] 受発注区分=2かつ発注先コードが正常な場合 => 更新できること", async () => {
      const productCode = "a0b001";

      const product = {
        productCode,
        orderKbn: "2",
      };

      const productInfo = {
        orderClientCode: "c0000001",
      };

      const findSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);

      const clientFindSpy = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce({
        clientCode: "c0000001",
      });

      const updateSpy = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      await productService.update(productCode, productInfo);

      expect(findSpy).toHaveBeenCalledWith(productCode);

      expect(clientFindSpy).toHaveBeenCalledWith("c0000001");

      expect(updateSpy).toHaveBeenCalledWith(
        productCode,
        expect.objectContaining({
          orderClientCode: "c0000001",
          updatedAt: expect.any(String),
        }),
      );
    });

    test("[正常系] 受発注区分=1かつ発注先コード未設定の場合 => 更新できること", async () => {
      const productCode = "a0b001";

      const product = {
        productCode,
        orderKbn: "1",
      };

      const productInfo = {};

      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);

      const updateSpy = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      await productService.update(productCode, productInfo);

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test("[異常系] 存在しない発注先コードの場合 => NotFoundErrorになること", async () => {
      // 更新対象商品
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        productCode: "a0b001",
        orderKbn: "2",
      });

      // 発注先コード不存在
      jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);

      // 検証
      await expect(
        productService.update("a0b001", {
          orderClientCode: "c0000001",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    test("[異常系] 商品コードが存在しない場合 => NotFoundErrorになること", async () => {
      // 更新対象商品
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      // 検証
      await expect(productService.update("a0b999", {})).rejects.toThrow(NotFoundError);
    });

    test("[異常系] 受発注区分=2かつ発注先コード未入力の場合 => ValidationErrorになること", async () => {
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        orderKbn: "2",
      });

      await expect(productService.update("a0b001", {})).rejects.toThrow(ValidationError);
    });

    test("[異常系] 受発注区分=2かつ発注先コードが8桁以外の場合 => ValidationError", async () => {
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        orderKbn: "2",
      });

      await expect(
        productService.update("a0b001", {
          orderClientCode: "c000001",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("[異常系] 受発注区分=2かつ発注先コードが半角英数以外の場合 => ValidationError", async () => {
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        orderKbn: "2",
      });

      await expect(
        productService.update("a0b001", {
          orderClientCode: "あ0000001",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("[異常系] 受発注区分=1で発注先コードが設定されている場合 => ValidationError", async () => {
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        orderKbn: "1",
      });

      await expect(
        productService.update("a0b001", {
          orderClientCode: "c0000001",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("delete 商品情報削除", () => {
    test("[正常系] 存在する商品コードを指定した場合 => 削除処理が実行されること", async () => {
      // 検索条件
      const productCode = "a0b001";

      // Mockデータ
      const product = {
        productCode: "a0b001",
        productName: "テスト商品",
      };

      // Mock設定
      const findSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);

      jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce([]);

      const deleteSpy = jest.spyOn(productRepository, "delete").mockResolvedValueOnce();

      // テスト対象
      await productService.delete(productCode);

      // 検証
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(productCode);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(productCode);
    });

    test("[異常系] 存在しない商品コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const productCode = "a0b999";

      // Mock設定
      const findSpy = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const deleteSpy = jest.spyOn(productRepository, "delete");

      // テスト対象・検証
      try {
        await productService.delete(productCode);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError);
        expect(e.field).toBe("productCode");
        expect(e.message).toBe("この商品コードは存在していません");
      }

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(productCode);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注情報で使用されている商品コードの場合 => ReferenceConstraintErrorになること", async () => {
      jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        productCode: "a0b001",
      });

      jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce([
        {
          orderNo: "o0000001",
        },
      ]);

      try {
        await productService.delete("a0b001");
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ReferenceConstraintError);
        expect(e.field).toBe("productCode");
        expect(e.message).toBe("この商品コードは受発注情報で使用されているため削除できません");
      }
    });
  });
});
