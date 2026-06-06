const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (data) => ipcRenderer.invoke("user:login", data),
  getMessageHistoryPaginated: (page, limit, sortBy, sortOrder) =>
    ipcRenderer.invoke("message-history:getPaginated", {
      page,
      limit,
      sortBy,
      sortOrder,
    }),
  getAll: () => ipcRenderer.invoke("user:getAll"),
  createNewUser: (payload) => ipcRenderer.invoke("user:createNewUser", payload),
  resetPassword: (payload) => ipcRenderer.invoke("user:resetPassword", payload),
  updatePassword: (payload) =>
    ipcRenderer.invoke("user:updatePassword", payload),
  getDashboardStats: () => ipcRenderer.invoke("stats:getDashboardStats"),
  getRecentMessages: () => ipcRenderer.invoke("stats:getRecentMessages"),
  getMostActiveUsers: () => ipcRenderer.invoke("stats:getMostActiveUsers"),

  getMonthlyUserActivity: () =>
    ipcRenderer.invoke("stats:getMonthlyUserActivity"),

  getMonthlyTopicTrends: () =>
    ipcRenderer.invoke("stats:getMonthlyTopicTrends"),

  getWeeklyTopicTrends: () => ipcRenderer.invoke("stats:getWeeklyTopicTrends"),

  getTopicFrequency: () => ipcRenderer.invoke("stats:getTopicFrequency"),

  getDailyUsage: () => ipcRenderer.invoke("stats:getDailyUsage"),

  getMonthlyUsage: () => ipcRenderer.invoke("stats:getMonthlyUsage"),

  getPeakUsageDays: () => ipcRenderer.invoke("stats:getPeakUsageDays"),

  getDeliveryOverview: () => ipcRenderer.invoke("stats:getDeliveryOverview"),

  getFailureTrend: () => ipcRenderer.invoke("stats:getFailureTrend"),

  getTopCommunicationCategory: () =>
    ipcRenderer.invoke("stats:getTopCommunicationCategory"),
  saveApplicationSetting: (payload) =>
    ipcRenderer.invoke("setting:saveSetting", payload),
  getApplicationSetting: () => ipcRenderer.invoke("settings:getSettings"),
  getCurrentSmsCredit: () => ipcRenderer.invoke("sms:getCurrentCredit"),
  sendSms: (payload) => ipcRenderer.invoke("sms:sendMessage", payload),
  onSmsProgress: (callback) => ipcRenderer.on("sms:progress", (_, data) => callback(data)),
  offSmsProgress: () => ipcRenderer.removeAllListeners("sms:progress"),
  getDeliveryReport: (payload) => ipcRenderer.invoke("sms:getDeliveryReport", payload),
});
