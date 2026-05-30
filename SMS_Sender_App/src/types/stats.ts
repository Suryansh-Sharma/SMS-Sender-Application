export type DashboardStatsResponse = {
  totalCampaigns: number;
  totalSmsSent: number;
  smsSentToday: number;
  failedSms: number;
};

export type RecentMessageResponse = {
  id: number;
  category: string;
  message: string;
  total_recipients: number;
  failed_count: number;
  status: string;
  sent_on: string;
  sent_by: string;
};

export type MostActiveUserResponse = {
  sent_by: string;
  campaigns: number;
  total_sms: number;
};

export type MonthlyUserActivityResponse = {
  month: string;
  sent_by: string;
  total: number;
};

export type MonthlyTopicTrendResponse = {
  month: string;
  category: string;
  total: number;
};

export type WeeklyTopicTrendResponse = {
  weekday: string;
  category: string;
  total: number;
};

export type TopicFrequencyResponse = {
  category: string;
  total: number;
};

export type DailyUsageResponse = {
  date: string;
  total: number;
};

export type MonthlyUsageResponse = {
  month: string;
  total: number;
};

export type PeakUsageDayResponse = {
  weekday: string;
  total: number;
};

export type DeliveryOverviewResponse = {
  totalSms: number;
  failedSms: number;
  successSms: number;
};

export type FailureTrendResponse = {
  date: string;
  failed: number;
};

export type TopCommunicationCategoryResponse = {
  category: string;
  total: number;
};

export type ReportType =
  | "sms-by-day"
  | "monthly-usage"
  | "weekly-topics"
  | "monthly-topic-trends"
  | "most-frequent-topic"
  | "monthly-user-activity"
  | "top-active-users"
  | "peak-usage-days"
  | "failure-trend"
  | "delivery-status";
