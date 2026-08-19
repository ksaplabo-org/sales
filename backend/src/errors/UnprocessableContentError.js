import BaseError from "./BaseError.js";

class UnprocessableContentError extends BaseError {
  static status = 422;

  constructor(field, message) {
    super(field, message);
  }
}

export default UnprocessableContentError;
