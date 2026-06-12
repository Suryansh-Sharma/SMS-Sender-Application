import { ipcMain } from "electron";
import { settingService } from "../services/settingService.js";
import { messageHistoryRepo } from "../repositories/messageHistoryRepo.js";
import https from "https";
import http from "http";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

function httpGet(urlString) {
  return new Promise((resolve, reject) => {
    const lib = urlString.startsWith("https") ? https : http;
    const req = lib.get(urlString, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    });
    req.setTimeout(REQUEST_TIMEOUT_MS, () => req.destroy(new Error("Request timed out")));
    req.on("error", reject);
  });
}

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
    req.setTimeout(REQUEST_TIMEOUT_MS, () => req.destroy(new Error("Request timed out")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function withRetry(fn) {
  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((res) => setTimeout(res, (attempt + 1) * 2000));
    }
  }
  throw lastErr;
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

      const body = await withRetry(() => httpGet(url.toString()));
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

      const total = recipients.length;

      // Enforce daily SMS limit before sending anything.
      const todaySent = messageHistoryRepo.getTodaySentCount();
      const dailyLimit = setting.dailySmsLimit ?? 5000;
      if (todaySent + total > dailyLimit) {
        return {
          success: false,
          message: `Daily limit of ${dailyLimit} would be exceeded. Already sent ${todaySent} SMS today (${dailyLimit - todaySent} remaining).`,
        };
      }

      let successCount = 0;
      let failedCount = 0;
      let groupId = null;

      // SpringEdge hard limit: max 25 recipients per comma-separated request.
      // Inter-chunk delay keeps us under their 150 req/min rate limit.
      const CHUNK_SIZE = 25;
      const INTER_CHUNK_DELAY_MS = 450;

      for (let i = 0; i < total; i += CHUNK_SIZE) {
        const chunk = recipients.slice(i, i + CHUNK_SIZE);

        try {
          const body = await withRetry(() =>
            httpPost(`${setting.smsUrl}/api/web/send/`, {
              apikey: setting.smsApiKey,
              sender: setting.senderId,
              to: chunk.join(","),
              message,
              format: "json",
            })
          );

          console.log("[SMS] API raw response:", body);

          let parsed;
          try { parsed = JSON.parse(body); } catch {
            console.error("[SMS] Non-JSON response:", body);
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
            console.error("[SMS] Unexpected status:", status, parsed);
            failedCount += chunk.length;
          }
        } catch (err) {
          console.error("[SMS] Request error after retries:", err);
          failedCount += chunk.length;
        }

        event.sender.send("sms:progress", {
          sent: Math.min(i + CHUNK_SIZE, total),
          total, successCount, failedCount,
        });

        // Respect SpringEdge 150 req/min rate limit between chunks.
        if (i + CHUNK_SIZE < total) {
          await new Promise((res) => setTimeout(res, INTER_CHUNK_DELAY_MS));
        }
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

      // A campaign where every chunk failed is a failure, not a success.
      if (campaignStatus === "FAILED") {
        return {
          success: false,
          message: "All messages failed to send. Check your API key and provider status.",
        };
      }

      return {
        success: true,
        data: { totalRecipients: total, successCount, failedCount, groupId, campaignStatus },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send SMS.",
      };
    }
  });

  ipcMain.handle("sms:getDeliveryReport", async (_, { groupId, campaignId }) => {
    try {
      const setting = settingService.getSetting();
      if (!setting.smsApiKey || !setting.smsUrl) {
        return { success: false, message: "SMS settings not configured." };
      }

      const url = new URL(`${setting.smsUrl}/api/report/delivery/`);
      url.searchParams.set("apikey", setting.smsApiKey);
      url.searchParams.set("groupid", groupId);
      url.searchParams.set("format", "json");

      const body = await withRetry(() => httpGet(url.toString()));
      console.log("[DLR] Raw response:", body);

      let records;
      try {
        const parsed = JSON.parse(body);
        records = Array.isArray(parsed) ? parsed : parsed.report ?? [];
      } catch {
        return { success: false, message: "Unexpected delivery report response." };
      }

      // SpringEdge confirmed status value is "DELIVRD" (not "DELIVERED").
      // Response shape: [{ id, Recipient, status, UpdatedTime }]
      const deliveredCount = records.filter(
        (r) => r.status === "DELIVRD"
      ).length;

      if (campaignId) {
        messageHistoryRepo.updateDelivery({ campaign_id: campaignId, delivered_count: deliveredCount });
      }

      return { success: true, data: { deliveredCount } };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch delivery report.",
      };
    }
  });
};
