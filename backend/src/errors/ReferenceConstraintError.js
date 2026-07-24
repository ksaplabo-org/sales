class ReferenceConstraint extends Error {
  static status = 409;

  constructor(message) {
    super(message);
  }
}

export default ReferenceConstraint;
