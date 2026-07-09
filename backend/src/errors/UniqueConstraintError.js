class UniqueConstraintError extends Error {
  static status = 409;
}

export default UniqueConstraintError;
