import UserRepository from "../repositories/UserRepository.js";

class UserService {
  repository = new UserRepository();

  async find(condition) {
    return await this.repository.find(condition);
  }

  async findById(id) {
    return await this.repository.findById(id);
  }

  async delete(userId) {
    await this.repository.delete(userId);
  }
}

export default UserService;
