import { settingRepo } from "../repositories/settingRepo.js";

export const settingService = {
  saveSetting: (payload) => {
    const {
      smsApiKey,
      senderId,
      smsUrl,
      orgName,
      orgPhone,
      orgEmail,
      orgAddress,
      dailySmsLimit,
      appVersion,
      settingsLastUpdatedBy,
    } = payload;

    if (!smsApiKey?.trim()) {
      throw new Error("SMS API Key is required.");
    }

    if (!senderId?.trim()) {
      throw new Error("Sender ID is required.");
    }

    if (!orgName?.trim()) {
      throw new Error("Organization name is required.");
    }

    if (orgEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgEmail)) {
      throw new Error("Invalid organization email.");
    }

    if (orgPhone && !/^\d{10}$/.test(orgPhone)) {
      throw new Error("Organization phone must be 10 digits.");
    }

    if (dailySmsLimit && Number(dailySmsLimit) <= 0) {
      throw new Error("Daily SMS limit must be greater than 0.");
    }

    if (senderId && senderId.length > 15) {
      throw new Error("Sender ID is too long.");
    }
    return settingRepo.saveSettings({
      smsApiKey: smsApiKey.trim(),
      senderId: senderId.trim(),
      smsUrl: smsUrl.trim(),
      orgName: orgName.trim(),
      orgPhone: orgPhone?.trim() || null,
      orgEmail: orgEmail?.trim() || null,
      orgAddress: orgAddress?.trim() || null,
      dailySmsLimit: Number(dailySmsLimit) || 5000,
      appVersion: appVersion?.trim() || "1.0.0",
      settingsLastUpdatedBy: settingsLastUpdatedBy || "SYSTEM",
    });
  },

  getSetting: () => {
    const setting = settingRepo.getSettings();
    if (!setting) {
      throw new Error("Setting is not present");
    }
    return setting;
  },
};
