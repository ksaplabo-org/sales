class UniqueConstraintError extends Error {
  static status = 409;

  constructor(message) {
    super(message);
  }
}

export default UniqueConstraintError;
