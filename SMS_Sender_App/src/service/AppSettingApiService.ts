import type {
  AppSettingApiResponse,
  AppSettingPayload,
  ValidatedSettingResponse,
} from "../types/appSetting";

export const AppSettingApiService = {
  saveSettings: async (payload: AppSettingPayload) => {
    const res = await window.api.saveApplicationSetting(payload);

    if (!res.success) {
      throw new Error(res.message || "Unable to save settings.");
    }

    return res.data;
  },
  getApplicationSetting: async (): Promise<AppSettingApiResponse> => {
    return await window.api.getApplicationSetting();
  },
  getValidatedSmsConfig: async (): Promise<ValidatedSettingResponse> => {
    const setting: AppSettingApiResponse =
      await window.api.getApplicationSetting();
    if (!setting.success) {
      throw new Error("Unable to get setting, Please Contact Admin.");
    }
    if (!setting.data?.smsApiKey) {
      throw new Error("Sms Api Key Missing, Please Contact Admin.");
    }
    if (!setting.data?.senderId) {
      throw new Error("Sms Sender Id is Missing, Please Contact Admin.");
    }
    if (!setting.data?.smsUrl) {
      throw new Error("Sms Url is Missing, Please Contact Admin.");
    }
    return {
      smsApiKey: setting.data.smsApiKey,
      senderId: setting.data.senderId,
      smsUrl: setting.data.smsUrl,
    };
  },
};
