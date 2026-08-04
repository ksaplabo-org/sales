import BaseError from "./BaseError.js";

class ReferenceConstraintError extends BaseError {
  static status = 409;

  constructor(field, message) {
    super(field, message);
  }
}

export default ReferenceConstraintError;
