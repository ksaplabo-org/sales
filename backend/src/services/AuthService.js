import userRepository from "../repositories/userRepository.js";

class AuthService {
  async login(userId, password) {
    const user = await userRepository.findById(userId);
    if (user && user.password === password && !user.delFlg) {
      const accessToken = jwt.sign(
        {
          userId: user.userId,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      return accessToken;
    }
    else {
    return null;
    }
  }
}

export default AuthService;
