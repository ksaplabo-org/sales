import { beforeEach, describe, expect, jest, test } from "@jest/globals";

// logger.errorの呼び出し確認用モック
const mockError = jest.fn();

// Loggerオブジェクトのモック
const mockLogger = {
  error: mockError,
};

// winston.createLoggerのモック
const mockCreateLogger = jest.fn(() => mockLogger);

// Logger設定確認用モック
const mockFile = jest.fn();
const mockTimestamp = jest.fn();
const mockPrintf = jest.fn();

jest.unstable_mockModule("winston", () => ({
  default: {
    createLogger: mockCreateLogger,
    format: {
      combine: jest.fn(),
      timestamp: mockTimestamp,
      printf: mockPrintf,
    },
    transports: {
      File: mockFile,
    },
  },
}));

// テスト対象
const logger = (await import("../../src/utils/Logger.js")).default;

describe("Logger", () => {
  beforeEach(() => {
    mockError.mockClear();
  });

  test("[正常系] ロガー生成時にログ出力設定が正しく行われること", () => {
    expect(mockFile).toHaveBeenCalledWith({
      filename: "logs/application.log",
    });

    expect(mockTimestamp).toHaveBeenCalledWith({
      format: "YYYY/MM/DD HH:mm:ss.SSS",
    });

    expect(mockPrintf).toHaveBeenCalledTimes(1);

    // printf に渡されたフォーマット関数を取得
    const formatter = mockPrintf.mock.calls[0][0];

    const actual = formatter({
      timestamp: "2026/11/05 10:00:00.000",
      level: "error",
      message: "テストメッセージ",
    });

    expect(actual).toBe("[2026/11/05 10:00:00.000] ERROR テストメッセージ");
  });

  test("[正常系] ERRORログ出力", () => {
    const error = new Error("テストエラー");

    logger.error("商品情報一覧取得処理に失敗しました。", error);

    expect(mockError).toHaveBeenCalledTimes(1);

    expect(mockError).toHaveBeenCalledWith(`商品情報一覧取得処理に失敗しました。\n${error.stack}`);
  });
});
