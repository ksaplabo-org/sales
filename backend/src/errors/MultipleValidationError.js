import BaseError from "./BaseError.js";

class MultipleValidationError extends BaseError {
  static status = 400;

  errors = [];

  constructor(errors) {
    super();
    this.errors = errors;
  }
}

export default MultipleValidationError;