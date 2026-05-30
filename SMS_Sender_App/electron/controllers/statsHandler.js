import { ipcMain } from "electron";
import { statsService } from "../services/statsService.js";

export const statsHandler = () => {
  ipcMain.handle("stats:getDashboardStats", async () => {
    return await statsService.getDashboardOverview();
  });

  ipcMain.handle("stats:getRecentMessages", async () => {
    return await statsService.getRecentMessages();
  });

  ipcMain.handle("stats:getMostActiveUsers", async () => {
    return await statsService.getMostActiveUsers();
  });

  ipcMain.handle("stats:getMonthlyUserActivity", async () => {
    return await statsService.getMonthlyUserActivity();
  });

  ipcMain.handle("stats:getMonthlyTopicTrends", async () => {
    return await statsService.getMonthlyTopicTrends();
  });

  ipcMain.handle("stats:getWeeklyTopicTrends", async () => {
    return await statsService.getWeeklyTopicTrends();
  });

  ipcMain.handle("stats:getTopicFrequency", async () => {
    return await statsService.getTopicFrequency();
  });

  ipcMain.handle("stats:getDailyUsage", async () => {
    return await statsService.getDailyUsage();
  });

  ipcMain.handle("stats:getMonthlyUsage", async () => {
    return await statsService.getMonthlyUsage();
  });

  ipcMain.handle("stats:getPeakUsageDays", async () => {
    return await statsService.getPeakUsageDays();
  });

  ipcMain.handle("stats:getDeliveryOverview", async () => {
    return await statsService.getDeliveryOverview();
  });

  ipcMain.handle("stats:getFailureTrend", async () => {
    return await statsService.getFailureTrend();
  });

  ipcMain.handle("stats:getTopCommunicationCategory", async () => {
    return await statsService.getTopCommunicationCategory();
  });
};
