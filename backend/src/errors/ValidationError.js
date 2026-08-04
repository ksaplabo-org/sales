import BaseError from "./BaseError.js";

class ValidationError extends BaseError {
  static status = 400;

  constructor(field, message) {
    super(field, message);
  }
}

export default ValidationError;
