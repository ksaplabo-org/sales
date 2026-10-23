import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class AuthService {
  async login(userId, password) {
    const user = await userRepository.findById(userId);
    if (user && user.password === password && !user.delFlg) {
      return jwt.sign(
        {
          userId: user.userId,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
    }
    return null;
  }
}

export default AuthService;
