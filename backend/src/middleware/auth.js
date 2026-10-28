import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const Bearer = "Bearer ";
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith(Bearer)) {
    return res.status(401).send();
  }

  const token = authHeader.replace(Bearer, "");

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
