import { userRepo } from "../repositories/userRepo.js";
export const userService = {
  login: async (name, password) => {
    const user = userRepo.findByUsername(name);
    if (!user) throw new Error("User not found");
    if (user.password != password) throw new Error("Invalid Password");
    return user;
  },
  getAll: async () => {
    return userRepo.getAll();
  },
  createNewUser: async (payload) => {
    const { name } = payload;

    if (!name) {
      throw new Error("Name is required");
    }

    return userRepo.createNewUser(payload);
  },
  resetPassword: async (payload) => {
    const { username } = payload;
    if (!username) {
      throw new Error("Username is required");
    }
    return userRepo.resetUserPassword(payload);
  },
  updatePassword: async (payload) => {
    const { username, password, newPassword } = payload;
    if (!username) {
      throw new Error("Username is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (!newPassword) {
      throw new Error("New Password is required");
    }
    return userRepo.updateCurrentPassword(payload);
  },
};
