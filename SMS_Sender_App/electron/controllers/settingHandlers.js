import { ipcMain } from "electron";
import { settingService } from "../services/settingService.js";

export const settingHandler = () => {
  ipcMain.handle("setting:saveSetting", async (_, payload) => {
    try {
      const setting = settingService.saveSetting(payload);
      return { success: true, data: setting };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to save settings.",
      };
    }
  });
  ipcMain.handle("settings:getSettings", async () => {
    try {
      const setting = settingService.getSetting();
      return {
        success: true,
        data: setting,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to fetch settings.",
      };
    }
  });
};
