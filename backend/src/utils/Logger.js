import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY/MM/DD HH:mm:ss.SSS",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} ${message}`;
    }),
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/application.log",
    }),
  ],
});

/**
 * ERRORログ出力
 *
 * @param {string} message メッセージ
 * @param {Error} error 例外オブジェクト
 */
const error = (message, error) => {
  logger.error(`${message}\n${error.stack}`);
};

export default {
  error,
};
