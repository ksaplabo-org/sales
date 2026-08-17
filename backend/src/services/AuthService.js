import userRepository from "../repositories/userRepository.js";

class AuthService {
  async login(userId, password) {
    const user = await userRepository.findById(userId);
    if (user && user.password === password && !user.delFlg) {
      return user;
    }
    return null;
  }
}

export default AuthService;
