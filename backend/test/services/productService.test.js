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
    jest.resetAllMocks();
  });

  describe("findAll 商品情報一覧取得", () => {
    test("[正常系] 検索結果が返却されること", async () => {
      // 検索条件
      const condition = { productCode: "a0b0001", productName: "テスト" };

      // 期待結果
      const expected = [{ productCode: "a0b0001", productName: "テスト" }];

      // Mock設定
      const spyFindAll = jest.spyOn(productRepository, "findAll").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await productService.findAll(condition);

      // 実行結果と期待結果が一致することを検証
      expect(actual).toEqual(expected);
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(spyFindAll).toHaveBeenCalledWith(condition);
    });
  });

  describe("findByCode 商品情報詳細取得", () => {
    test("[正常系] 存在する商品コードを指定した場合 => 商品情報が返却されること", async () => {
      // 検索条件
      const productCode = "a0b0001";

      // 期待結果
      const expected = { productCode: "a0b0001", productName: "テスト" };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(expected);

      // テスト対象関数の呼び出し
      const actual = await productService.findByCode(productCode);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(actual).toEqual(expected);
    });

    test("[異常系] 存在しない商品コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const productCode = "a0b999";

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);

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
      expect(spyFindByCode).toHaveBeenCalledTimes(1); //Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productCode); //Mockした関数呼び出し時の引数を検証
    });
  });

  describe("create 商品情報登録", () => {
    test("[正常系] 受発注区分=2の場合かつ取引先コードが存在する場合 => 登録できること", async () => {
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      // 登録情報
      const productInfo = {
        productCode: "a0b0001",
        productName: "テスト商品",
        orderKbn: "2",
        orderClientCode: "c0000001",
        productPrice: 1000,
      };

      // Mock設定
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce({
        clientCode: productInfo.orderClientCode,
      });
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productService.create(productInfo);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productInfo.productCode);
      expect(spyClientFindByCode).toHaveBeenCalledTimes(1);
      expect(spyClientFindByCode).toHaveBeenCalledWith(productInfo.orderClientCode);
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(productInfo);
      expect(productInfo.createdAt).toBe(mockDate.toISOString());
      expect(productInfo.updatedAt).toBe(mockDate.toISOString());
      jest.useRealTimers();
    });

    test("[正常系] 受発注区分=1の場合 => 登録できること", async () => {
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      // 登録情報
      const productInfo = {
        productCode: "a0b0001",
        productName: "テスト商品",
        orderKbn: "1",
        productPrice: 1000,
      };

      // Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyCreate = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象関数の呼び出し
      await productService.create(productInfo);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productInfo.productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(productInfo);
      expect(productInfo.createdAt).toBe(mockDate.toISOString());
      expect(productInfo.updatedAt).toBe(mockDate.toISOString());
      jest.useRealTimers();
    });

    test("[異常系] 既に存在する商品コードを指定した場合 => UniqueConstraintErrorとなること", async () => {
      // 登録情報
      const productInfo = {
        productCode: "a0b0001",
        productName: "テスト商品",
      };

      // Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(productInfo);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyCreate = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象・検証
      try {
        //テスト対象関数の呼び出し
        await productService.create(productInfo);
        //エラーが発生しなかった場合は失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(UniqueConstraintError); //スローしたエラーの検証
        expect(e.field).toBe("productCode"); //エラーフィールドの検証
        expect(e.message).toBe("この商品コードは既に登録されているため登録できません"); //エラーメッセージの検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productInfo.productCode); // Mockした関数呼び出し時の引数を検証
      expect(spyClientFindByCode).not.toHaveBeenCalled(); // Mockした関数が呼び出されていないことを検証
      expect(spyCreate).not.toHaveBeenCalled(); // Mockした関数が呼び出されていないことを検証
    });

    test("[異常系] 受発注区分=2かつ存在しない発注先コードの場合 => NotFoundErrorになること", async () => {
      const productInfo = {
        productCode: "a0b0001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mockの設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(productRepository, "create").mockResolvedValueOnce();

      // テスト対象・検証
      try {
        //テスト対象関数の呼び出し
        await productService.create(productInfo);
        //エラーが発生しなかった場合は失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError); //スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); //エラーフィールドの検証
        expect(e.message).toBe("この発注先コードは存在していません"); //エラーメッセージの検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productInfo.productCode); // Mockした関数呼び出し時の引数を検証
      expect(spyClientFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyClientFindByCode).toHaveBeenCalledWith(productInfo.orderClientCode); // Mockした関数呼び出し時の引数を検証
      expect(spyCreate).not.toHaveBeenCalled(); // Mockした関数が呼び出されていないことを検証
    });
  });

  describe("update 商品情報更新", () => {
    test("[正常系] 受発注区分=2かつ発注先コードが正常な場合 => 更新できること", async () => {
      //検索条件
      const productCode = "a0b0001";

      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //mock返却データ
      const product = {
        productCode: productCode,
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce({
        clientCode: productInfo.orderClientCode,
      });
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      //テスト対象関数の呼び出し
      await productService.update(productCode, productInfo);

      //検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).toHaveBeenCalledTimes(1);
      expect(spyClientFindByCode).toHaveBeenCalledWith(productInfo.orderClientCode);
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(productCode, productInfo);
      expect(productInfo.updatedAt).toBe(mockDate.toISOString());
      jest.useRealTimers();
    });

    test("[正常系] 受発注区分=1かつ発注先コード未設定の場合 => 更新できること", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "1",
      };

      //mock返却データ
      const product = {
        productCode: productCode,
        orderKbn: "1",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      //テスト対象関数の呼び出し
      await productService.update(productCode, productInfo);

      //検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(productCode, productInfo);
      expect(productInfo.updatedAt).toBe(mockDate.toISOString());
      jest.useRealTimers();
    });

    test("[異常系] 受発注区分=2かつ存在しない発注先コードの場合 => NotFoundErrorになること", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //mock返却データ
      const product = {
        productCode: productCode,
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode").mockResolvedValueOnce(null);
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("この発注先コードは存在していません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).toHaveBeenCalledTimes(1);
      expect(spyClientFindByCode).toHaveBeenCalledWith(productInfo.orderClientCode);
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 商品コードが存在しない場合 => NotFoundErrorになること", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError); // スローしたエラーの検証
        expect(e.field).toBe("productCode"); // エラーフィールドを検証
        expect(e.message).toBe("この商品コードは存在していません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=2かつ発注先コード未入力の場合 => ValidationErrorになること", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "",
      };

      //mock返却データ
      const product = {
        productCode: "a0b0001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("発注先コードが設定されていません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=2かつ発注先コードが8桁以外(7桁)の場合 => ValidationError", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "c000001",
      };

      //mock返却データ
      const product = {
        productCode: "a0b0001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("発注先コードは8桁で設定してください"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=2かつ発注先コードが8桁以外(9桁)の場合 => ValidationError", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "c00000001",
      };

      //mock返却データ
      const product = {
        productCode: "a0b0001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("発注先コードは8桁で設定してください"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=2かつ発注先コードが半角英数以外の場合 => ValidationError", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "2",
        orderClientCode: "あ0000001",
      };

      //mock返却データ
      const product = {
        productCode: "a0b0001",
        orderKbn: "2",
        orderClientCode: "c0000001",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("発注先コードは半角英数で設定してください"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分=1で発注先コードが設定されている場合 => ValidationError", async () => {
      //検索条件
      const productCode = "a0b0001";

      //現在日時をmock
      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "1",
        orderClientCode: "c0000001",
      };

      //mock返却データ
      const product = {
        productCode: "a0b0001",
        orderKbn: "1",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      try {
        // テスト対象関数の呼び出し
        await productService.update(productCode, productInfo);
        // エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError); // スローしたエラーの検証
        expect(e.field).toBe("orderClientCode"); // エラーフィールドを検証
        expect(e.message).toBe("発注先コードは設定できません"); // エラーメッセージを検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    test("[異常系] 受発注区分が1または2以外（受発注区分=3）の場合 => 誤って更新される", async () => {
      //検索条件
      const productCode = "a0b0001";

      const mockDate = new Date(); //現在日時を保存

      jest.useFakeTimers(); //検証用の仮想時間を使用
      jest.setSystemTime(mockDate); //日時をmockDateに固定

      //更新情報
      const productInfo = {
        orderKbn: "3",
      };

      //mock返却データ
      const product = {
        productCode: productCode,
        orderKbn: "0",
      };

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyClientFindByCode = jest.spyOn(clientRepository, "findByCode");
      const spyUpdate = jest.spyOn(productRepository, "update").mockResolvedValueOnce();

      //テスト対象関数の呼び出し
      await productService.update(productCode, productInfo);

      //検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1);
      expect(spyFindByCode).toHaveBeenCalledWith(productCode);
      expect(spyClientFindByCode).not.toHaveBeenCalled();
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(productCode, productInfo);
      expect(productInfo.updatedAt).toBe(mockDate.toISOString());
      jest.useRealTimers();
    });
  });

  describe("delete 商品情報削除", () => {
    test("[正常系] 存在する商品コードを指定した場合 => 削除処理が実行されること", async () => {
      // 検索条件
      const productCode = "a0b0001";

      // Mockデータ
      const product = {
        productCode: "a0b0001",
      };

      // Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(product);
      const spyOrderFindAll = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce([]);
      const spyDelete = jest.spyOn(productRepository, "delete").mockResolvedValueOnce();

      // テスト対象
      await productService.delete(productCode);

      // 検証
      expect(spyFindByCode).toHaveBeenCalledTimes(1); //Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productCode); // Mockした関数呼び出し時の引数を検証
      expect(spyOrderFindAll).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyOrderFindAll).toHaveBeenCalledWith(product); // Mockした関数呼び出し時の引数を検証
      expect(spyDelete).toHaveBeenCalledTimes(1); //Mockした関数の呼び出し回数を検証
      expect(spyDelete).toHaveBeenCalledWith(productCode); // Mockした関数呼び出し時の引数を検証
    });

    test("[異常系] 存在しない商品コードを指定した場合 => NotFoundErrorとなること", async () => {
      // 検索条件
      const productCode = "a0b999";

      // Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce(null);
      const spyOrderFindAll = jest.spyOn(orderRepository, "findAll");
      const spyDelete = jest.spyOn(productRepository, "delete").mockResolvedValueOnce();

      // テスト対象・検証
      try {
        //テスト対象関数の呼び出し
        await productService.delete(productCode);
        //エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError); //スローしたエラーの検証
        expect(e.field).toBe("productCode"); //エラーフィールドの検証
        expect(e.message).toBe("この商品コードは存在していません"); //エラーメッセージの検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productCode); // Mockした関数呼び出し時の引数を検証
      expect(spyOrderFindAll).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
    });

    test("[異常系] 受発注情報で使用されている商品コードの場合 => ReferenceConstraintErrorになること", async () => {
      //検索条件
      const productCode = "a0b0001";

      //Mock設定
      const spyFindByCode = jest.spyOn(productRepository, "findByCode").mockResolvedValueOnce({
        productCode: productCode,
      });
      const spyOrderFindAll = jest.spyOn(orderRepository, "findAll").mockResolvedValueOnce([
        {
          productCode: productCode,
        },
      ]);
      const spyDelete = jest.spyOn(productRepository, "delete").mockResolvedValueOnce();

      try {
        //テスト対象関数の呼び出し
        await productService.delete(productCode);
        //エラーが発生しなかった場合はテスト失敗
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ReferenceConstraintError); //スローしたエラーの検証
        expect(e.field).toBe("productCode"); //エラーフィールドの検証
        expect(e.message).toBe("この商品コードは受発注情報で使用されているため削除できません"); //エラーメッセージの検証
      }
      expect(spyFindByCode).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyFindByCode).toHaveBeenCalledWith(productCode); // Mockした関数呼び出し時の引数を検証
      expect(spyOrderFindAll).toHaveBeenCalledWith({ productCode: productCode }); //Mockした関数呼び出し時の引数の検証
      expect(spyOrderFindAll).toHaveBeenCalledTimes(1); // Mockした関数の呼び出し回数を検証
      expect(spyDelete).not.toHaveBeenCalled(); // Mockした関数の呼び出し回数を検証
    });
  });
});
