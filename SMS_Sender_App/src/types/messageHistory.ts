export type MessageHistory = {
  id: number;
  campaign_id: string;
  category: string;
  message: string;
  total_recipients: number;
  total_token_used: number;
  failed_count: number;
  delivered_count: number;
  status: "SENT" | "PARTIAL" | "FAILED";
  springedge_group_id: string | null;
  sent_on: string;
  sent_by: string;
};
