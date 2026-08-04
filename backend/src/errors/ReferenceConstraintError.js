import BaseError from "./BaseError.js";

class ReferenceConstraintError extends Baserror {
  static status = 409;

  constructor(field, message) {
    super(field, message);
  }
}

export default ReferenceConstraintError;
