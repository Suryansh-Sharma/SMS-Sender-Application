import { ipcMain } from "electron";
import { userService } from "../services/userService.js";

export const registerUserHandlers = () => {
  ipcMain.handle("user:login", async (_, { username, password }) => {
    try {
      const user = await userService.login(username, password);

      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
  ipcMain.handle("user:getAll", async (_) => {
    return await userService.getAll();
  });
  ipcMain.handle("user:createNewUser", async (_, payload) => {
    try {
      const user = await userService.createNewUser(payload);

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  });
  ipcMain.handle("user:resetPassword", async (_, payload) => {
    try {
      await userService.resetPassword(payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  });
  ipcMain.handle("user:updatePassword", async (_, payload) => {
    try {
      await userService.updatePassword(payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  });
};
