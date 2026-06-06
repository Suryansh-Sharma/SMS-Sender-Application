import { AppSettingPayload } from "./appSetting";
import type {
  CreateUserPayload,
  CreateUserResponse,
  LoginResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  User,
} from "./auth";

import type { PaginationResponse } from "./common";

import type { MessageHistory } from "./messageHistory";

import type {
  DashboardStatsResponse,
  DeliveryOverviewResponse,
  FailureTrendResponse,
  MonthlyTopicTrendResponse,
  MonthlyUsageResponse,
  MonthlyUserActivityResponse,
  MostActiveUserResponse,
  PeakUsageDayResponse,
  TopCommunicationCategoryResponse,
  TopicFrequencyResponse,
  WeeklyTopicTrendResponse,
} from "./stats";

export {};

declare global {
  interface Window {
    api: {
      // Auth
      login: (data: {
        username: string;
        password: string;
      }) => Promise<LoginResponse>;

      // Users
      getAll: () => Promise<User[]>;

      createNewUser: (
        payload: CreateUserPayload,
      ) => Promise<CreateUserResponse>;

      resetPassword: (
        payload: ResetPasswordPayload,
      ) => Promise<ResetPasswordResponse>;

      updatePassword: (
        payload: UpdatePasswordPayload,
      ) => Promise<UpdatePasswordResponse>;

      // Message History
      getMessageHistoryPaginated: (
        page: number,
        limit: number,
        sortBy?: string,
        sortOrder?: string,
      ) => Promise<PaginationResponse<MessageHistory>>;

      // Dashboard
      getDashboardStats: () => Promise<DashboardStatsResponse>;

      getRecentMessages: () => Promise<MessageHistory[]>;

      getMostActiveUsers: () => Promise<MostActiveUserResponse[]>;

      getMonthlyUserActivity: () => Promise<MonthlyUserActivityResponse[]>;

      getMonthlyTopicTrends: () => Promise<MonthlyTopicTrendResponse[]>;

      getWeeklyTopicTrends: () => Promise<WeeklyTopicTrendResponse[]>;

      getTopicFrequency: () => Promise<TopicFrequencyResponse[]>;

      getDailyUsage: () => Promise<
        {
          date: string;
          total: number;
        }[]
      >;

      getMonthlyUsage: () => Promise<MonthlyUsageResponse[]>;

      getPeakUsageDays: () => Promise<PeakUsageDayResponse[]>;

      getDeliveryOverview: () => Promise<DeliveryOverviewResponse>;

      getFailureTrend: () => Promise<FailureTrendResponse[]>;

      getTopCommunicationCategory: () => Promise<TopCommunicationCategoryResponse>;
      saveApplicationSetting: (
        payload: AppSettingPayload,
      ) => Promise<AppSettingApiResponse>;
      getApplicationSetting: () => Promise<AppSettingApiResponse>;
      getCurrentSmsCredit: () => Promise<{ success: boolean; data?: number; message?: string }>;
      sendSms: (payload: {
        recipients: string[];
        message: string;
        category: string;
        sentBy: string;
      }) => Promise<{
        success: boolean;
        message?: string;
        data?: {
          totalRecipients: number;
          successCount: number;
          failedCount: number;
          groupId: string | null;
          campaignStatus: "SENT" | "PARTIAL" | "FAILED";
        };
      }>;
      onSmsProgress: (callback: (data: { sent: number; total: number; successCount: number; failedCount: number }) => void) => void;
      offSmsProgress: () => void;
      getDeliveryReport: (payload: { groupId: string; campaignId: string }) => Promise<{
        success: boolean;
        data?: { deliveredCount: number };
        message?: string;
      }>;
    };
  }
}
