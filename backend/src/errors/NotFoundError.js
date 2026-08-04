import BaseError from "./BaseError.js";

class NotFoundError extends BaseError {
  static status = 404;

  constructor(field, message) {
    super(field, message);
  }
}

export default NotFoundError;
