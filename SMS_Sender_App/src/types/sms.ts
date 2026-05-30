export type SendSmsPayload = {
  category: string;
  message: string;
  recipients: string[];
  sentBy: string;
};

export type SmsResult = {
  totalRecipients: number;
  successCount: number;
  failedCount: number;
  groupId?: string;
};
