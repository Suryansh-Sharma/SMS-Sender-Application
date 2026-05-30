export const SmsSpiApiService = {
  getCurrentSmsCredit: async () => {
    const response = await window.api.getCurrentSmsCredit();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch SMS credit.");
    }
    return response.data;
  },

  sendSms: async (payload: {
    recipients: string[];
    message: string;
    category: string;
    sentBy: string;
  }) => {
    const response = await window.api.sendSms(payload);
    if (!response.success) {
      throw new Error(response.message || "Failed to send SMS.");
    }
    return response.data!;
  },
};
