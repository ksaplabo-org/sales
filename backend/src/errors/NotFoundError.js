class NotFoundError extends Error {
  static status = 404;

  constructor(message) {
    super(message);
  }
}

export default NotFoundError;
