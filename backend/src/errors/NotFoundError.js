import BaseError from "./BaseError.js";

class NotFoundError extends Baserror {
  static status = 404;

  constructor(field, message) {
    super(field, message);
  }
}

export default NotFoundError;
