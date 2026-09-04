import BaseError from "./BaseError.js";

class OrderValidationError extends BaseError {
  static status = 400;

  constructor(errors) {
    super(null,null);
    this.errors = errors;
  }
}

export default OrderValidationError;