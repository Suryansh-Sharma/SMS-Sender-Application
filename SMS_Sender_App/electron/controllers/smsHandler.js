import { ipcMain } from "electron";
import { settingService } from "../services/settingService.js";
import { messageHistoryRepo } from "../repositories/messageHistoryRepo.js";
import https from "https";
import http from "http";

function httpGet(urlString) {
  return new Promise((resolve, reject) => {
    const lib = urlString.startsWith("https") ? https : http;
    lib.get(urlString, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

// POST with application/x-www-form-urlencoded body — used for bulk sends
function httpPost(urlString, params) {
  return new Promise((resolve, reject) => {
    const lib = urlString.startsWith("https") ? https : http;
    const body = new URLSearchParams(params).toString();
    const parsed = new URL(urlString);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export const smsHandler = () => {
  ipcMain.handle("sms:getCurrentCredit", async () => {
    try {
      const setting = settingService.getSetting();
      if (!setting.smsApiKey || !setting.smsUrl) {
        return { success: false, message: "SMS API key or URL is not configured." };
      }

      const url = new URL(`${setting.smsUrl}/api/status/credit`);
      url.searchParams.set("apikey", setting.smsApiKey);

      const body = await new Promise((resolve, reject) => {
        https.get(url.toString(), (res) => {
          let raw = "";
          res.on("data", (chunk) => (raw += chunk));
          res.on("end", () => resolve(raw));
        }).on("error", reject);
      });

      const match = body.match(/<credits>([\d.]+)<\/credits>/);
      if (!match) {
        return { success: false, message: "Unexpected response from SMS provider." };
      }

      return { success: true, data: parseFloat(match[1]) };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch SMS credit.",
      };
    }
  });

  ipcMain.handle("sms:sendMessage", async (event, { recipients, message, category, sentBy }) => {
    try {
      const setting = settingService.getSetting();
      if (!setting.smsApiKey || !setting.smsUrl || !setting.senderId) {
        return { success: false, message: "SMS settings not fully configured." };
      }

      let successCount = 0;
      let failedCount = 0;
      let groupId = null;
      const total = recipients.length;

      // Spring Edge accepts comma-separated numbers in a single POST.
      // Chunk at 300 to stay within safe POST body limits.
      const CHUNK_SIZE = 300;

      for (let i = 0; i < total; i += CHUNK_SIZE) {
        const chunk = recipients.slice(i, i + CHUNK_SIZE);

        try {
          const body = await httpPost(`${setting.smsUrl}/api/web/send/`, {
            apikey: setting.smsApiKey,
            sender: setting.senderId,
            to: chunk.join(","),
            message,
            format: "json",
          });

          console.log("[SMS] API raw response:", body);

          let parsed;
          try { parsed = JSON.parse(body); } catch {
            console.error("[SMS] Non-JSON response (plain-text error):", body);
            failedCount += chunk.length;
            event.sender.send("sms:progress", {
              sent: Math.min(i + CHUNK_SIZE, total),
              total, successCount, failedCount,
              lastError: body.trim(),
            });
            continue;
          }

          console.log("[SMS] Parsed response:", parsed);
          const status = parsed.status ?? "";
          if (status === "AWAITED-DLR" || status === "AWAITED_DLR") {
            successCount += chunk.length;
            if (!groupId && parsed.groupID) groupId = String(parsed.groupID);
          } else {
            console.error("[SMS] Unexpected status:", status, "Full response:", parsed);
            failedCount += chunk.length;
          }
        } catch (err) {
          console.error("[SMS] Request error:", err);
          failedCount += chunk.length;
        }

        event.sender.send("sms:progress", {
          sent: Math.min(i + CHUNK_SIZE, total),
          total, successCount, failedCount,
        });
      }

      const campaignStatus =
        failedCount === 0 ? "SENT" : successCount === 0 ? "FAILED" : "PARTIAL";

      messageHistoryRepo.save({
        campaign_id: `CAMP-${Date.now()}`,
        category,
        message,
        total_recipients: total,
        total_token_used: successCount,
        failed_count: failedCount,
        status: campaignStatus,
        springedge_group_id: groupId,
        sent_by: sentBy,
      });

      return {
        success: true,
        data: { totalRecipients: total, successCount, failedCount, groupId },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send SMS.",
      };
    }
  });
};
