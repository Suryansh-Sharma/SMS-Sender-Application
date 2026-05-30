import { statsRepo } from "../repositories/statsRepo.js";

export const statsService = {
  getDashboardOverview: async () => {
    return statsRepo.getDashboardOverview();
  },

  getRecentMessages: async () => {
    return statsRepo.getRecentMessages();
  },

  getMostActiveUsers: async () => {
    return statsRepo.getMostActiveUsers();
  },

  getMonthlyUserActivity: async () => {
    return statsRepo.getMonthlyUserActivity();
  },

  getMonthlyTopicTrends: async () => {
    return statsRepo.getMonthlyTopicTrends();
  },

  getWeeklyTopicTrends: async () => {
    return statsRepo.getWeeklyTopicTrends();
  },

  getTopicFrequency: async () => {
    return statsRepo.getTopicFrequency();
  },

  getDailyUsage: async () => {
    return statsRepo.getDailyUsage();
  },

  getMonthlyUsage: async () => {
    return statsRepo.getMonthlyUsage();
  },

  getPeakUsageDays: async () => {
    return statsRepo.getPeakUsageDays();
  },

  getDeliveryOverview: async () => {
    return statsRepo.getDeliveryOverview();
  },

  getFailureTrend: async () => {
    return statsRepo.getFailureTrend();
  },

  getTopCommunicationCategory: async () => {
    return statsRepo.getTopCommunicationCategory();
  },
};

export default statsService;
