import { ipcMain } from "electron";
import { messageHistoryService } from "../services/messageHistoryService.js";

export const registerMessageHistoryHandlers = () => {
  ipcMain.handle(
    "message-history:getPaginated",
    async (_, { page, limit, sortBy, sortOrder }) => {
      return messageHistoryService.getHistory(page, limit, sortBy, sortOrder);
    },
  );
};
