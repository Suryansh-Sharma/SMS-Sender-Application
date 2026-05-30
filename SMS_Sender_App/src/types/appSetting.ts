export type AppSettingApiResponse = {
  success?: boolean;
  data?: AppSettingResponse;
  message?: string;
};
export type AppSettingResponse = {
  id: number;
  smsApiKey: string | null;
  senderId: string | null;
  smsUrl: string | null;
  dailySmsLimit: number;
  orgName: string | null;
  orgPhone: string | null;
  orgEmail: string | null;
  orgAddress: string | null;
  appVersion: string | null;
  appInstalledOn: string | null;
  settingsLastUpdatedOn: string | null;
  settingsLastUpdatedBy: string | null;
};
export type AppSettingPayload = {
  smsApiKey: string;
  senderId: string;
  smsUrl?: string;
  orgName: string;
  orgPhone?: string;
  orgEmail?: string;
  orgAddress?: string;
  dailySmsLimit?: number;
  appVersion?: string;
  settingsLastUpdatedBy?: string;
};

export type ValidatedSettingResponse = {
  smsApiKey?: string;
  senderId?: string;
  smsUrl?: string;
};
