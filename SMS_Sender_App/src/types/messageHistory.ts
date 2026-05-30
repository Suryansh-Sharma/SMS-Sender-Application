export type MessageHistory = {
  id: number;
  campaignId: string;
  category: string;
  message: string;
  totalRecipients: number;
  totalTokenUsed: number;
  failedCount: number;
  status: string;
  sentOn: string;
  sentBy: string;
};
