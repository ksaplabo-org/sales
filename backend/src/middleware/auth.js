import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const AUTH_SCHEME_BEARER = "Bearer ";
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith(AUTH_SCHEME_BEARER)) {
    return res.status(401).send();
  }

  const token = authHeader.replace(AUTH_SCHEME_BEARER, "");

  try {
    const loginInfo = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: loginInfo.userId,
      role: loginInfo.role,
    };

    next();
  } catch {
    return res.status(401).send();
  }
};

export default authenticateToken;
