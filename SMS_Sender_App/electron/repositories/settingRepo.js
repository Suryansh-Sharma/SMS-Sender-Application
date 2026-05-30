import { db } from "../db/db.js";
import { safeStorage } from "electron";
export const settingRepo = {
  saveSettings: ({
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
  }) => {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error("OS encryption is not available on this system.");
    }
    const encryptedKey = safeStorage
      .encryptString(smsApiKey)
      .toString("base64");

    return db
      .prepare(
        `
        INSERT OR REPLACE INTO app_setting (
          id,
          smsApiKey,
          senderId,
          smsUrl,
          orgName,
          orgPhone,
          orgEmail,
          orgAddress,
          dailySmsLimit,
          appVersion,
          settingsLastUpdatedOn,
          settingsLastUpdatedBy
        )
        VALUES (
          1,
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          CURRENT_TIMESTAMP,
          ?

        )
      `,
      )
      .run(
        encryptedKey,
        senderId,
        smsUrl,
        orgName,
        orgPhone,
        orgEmail,
        orgAddress,
        dailySmsLimit,
        appVersion,
        settingsLastUpdatedBy,
      );
  },
  getSettings: () => {
    const row = db.prepare(`SELECT * FROM app_setting WHERE id=1`).get();
    if (!row) return null;
    if (row.smsApiKey) {
      const buffer = Buffer.from(row.smsApiKey, "base64");
      row.smsApiKey = safeStorage.decryptString(buffer);
    }
    return row;
  },
};
