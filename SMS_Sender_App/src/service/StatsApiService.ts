import type { MessageHistory } from "../types/messageHistory";

import type {
  DashboardStatsResponse,
  DeliveryOverviewResponse,
  FailureTrendResponse,
  MonthlyTopicTrendResponse,
  MonthlyUsageResponse,
  MonthlyUserActivityResponse,
  MostActiveUserResponse,
  PeakUsageDayResponse,
  TopicFrequencyResponse,
  TopCommunicationCategoryResponse,
  WeeklyTopicTrendResponse,
} from "../types/stats";

export const statsApiService = {
  getDashboardApi: async (): Promise<DashboardStatsResponse> => {
    return await window.api.getDashboardStats();
  },

  getRecentMessages: async (): Promise<MessageHistory[]> => {
    return await window.api.getRecentMessages();
  },

  getMostActiveUsers: async (): Promise<MostActiveUserResponse[]> => {
    return await window.api.getMostActiveUsers();
  },

  getMonthlyUserActivity: async (): Promise<MonthlyUserActivityResponse[]> => {
    return await window.api.getMonthlyUserActivity();
  },

  getMonthlyTopicTrends: async (): Promise<MonthlyTopicTrendResponse[]> => {
    return await window.api.getMonthlyTopicTrends();
  },

  getWeeklyTopicTrends: async (): Promise<WeeklyTopicTrendResponse[]> => {
    return await window.api.getWeeklyTopicTrends();
  },

  getTopicFrequency: async (): Promise<TopicFrequencyResponse[]> => {
    return await window.api.getTopicFrequency();
  },

  getDailyUsage: async (): Promise<
    {
      date: string;
      total: number;
    }[]
  > => {
    return await window.api.getDailyUsage();
  },

  getMonthlyUsage: async (): Promise<MonthlyUsageResponse[]> => {
    return await window.api.getMonthlyUsage();
  },

  getPeakUsageDays: async (): Promise<PeakUsageDayResponse[]> => {
    return await window.api.getPeakUsageDays();
  },

  getDeliveryOverview: async (): Promise<DeliveryOverviewResponse> => {
    return await window.api.getDeliveryOverview();
  },

  getFailureTrend: async (): Promise<FailureTrendResponse[]> => {
    return await window.api.getFailureTrend();
  },

  getTopCommunicationCategory:
    async (): Promise<TopCommunicationCategoryResponse> => {
      return await window.api.getTopCommunicationCategory();
    },
};

export default statsApiService;
