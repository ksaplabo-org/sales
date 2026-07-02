import UserRepository from "../repositories/UserRepository.js";

class AuthService {
  userRepository = new UserRepository();

  async login(userId, password) {
    const user = await this.userRepository.findById(userId);
    if (user && user.password === password && !user.delFlg) {
      return user;
    }
    console.log(user);
    console.log(user.password);
    console.log(password);
    console.log(user.password === password);
    console.log(!user.delFlg);
    return null;
  }
}

export default AuthService;
