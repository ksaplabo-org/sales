class BaseError extends Error {
  constructor(field, message) {
    super(message);

    this.field = field;
  }
}

export default BaseError;
