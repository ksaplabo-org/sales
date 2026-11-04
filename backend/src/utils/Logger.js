import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY/MM/DD HH:mm:ss.sss",
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
 */
const error = (message) => {
  logger.error(message);
};

export default {
  error,
};
