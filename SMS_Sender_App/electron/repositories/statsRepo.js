import { db } from "../db/db.js";

export const statsRepo = {
  getDashboardOverview: async () => {
    const totalMessageSent = db
      .prepare(
        `
      SELECT COUNT(*) as total
      FROM message_history
    `,
      )
      .get();

    const totalSmsSent = db
      .prepare(
        `
      SELECT
        SUM(total_recipients) as total
      FROM message_history
    `,
      )
      .get();

    const smsSentToday = db
      .prepare(
        `
      SELECT
        SUM(total_recipients) as total
      FROM message_history
      WHERE DATE(sent_on) = DATE('now')
    `,
      )
      .get();

    const failedSms = db
      .prepare(
        `
      SELECT
        SUM(failed_count) as total
      FROM message_history
    `,
      )
      .get();

    return {
      totalCampaigns: totalMessageSent.total || 0,

      totalSmsSent: totalSmsSent.total || 0,

      smsSentToday: smsSentToday.total || 0,

      failedSms: failedSms.total || 0,
    };
  },
  getRecentMessages: () => {
    return db
      .prepare(
        `
      SELECT
        id,
        category,
        message,
        total_recipients,
        failed_count,
        status,
        sent_on,
        sent_by
      FROM message_history
      ORDER BY sent_on DESC
      LIMIT 5
    `,
      )
      .all();
  },
  getMostActiveUsers: () => {
    return db
      .prepare(
        `
        SELECT
          sent_by,
          COUNT(*) as campaigns,
          SUM(total_recipients) as total_sms
        FROM message_history
        GROUP BY sent_by
        ORDER BY total_sms DESC
      `,
      )
      .all();
  },
  getMonthlyUserActivity: () => {
    return db
      .prepare(
        `
        SELECT
          strftime('%Y-%m', sent_on) as month,
          sent_by,
          COUNT(*) as total
        FROM message_history
        GROUP BY month, sent_by
        ORDER BY month
      `,
      )
      .all();
  },
  getMonthlyTopicTrends: () => {
    return db
      .prepare(
        `
        SELECT
          strftime('%Y-%m', sent_on) as month,
          category,
          COUNT(*) as total
        FROM message_history
        GROUP BY month, category
        ORDER BY month
      `,
      )
      .all();
  },
  getWeeklyTopicTrends: () => {
    return db
      .prepare(
        `
        SELECT
          strftime('%w', sent_on) as weekday,
          category,
          COUNT(*) as total
        FROM message_history
        GROUP BY weekday, category
        ORDER BY weekday
      `,
      )
      .all();
  },
  getTopicFrequency: () => {
    return db
      .prepare(
        `
        SELECT
          category,
          COUNT(*) as total
        FROM message_history
        GROUP BY category
        ORDER BY total DESC
      `,
      )
      .all();
  },
  getDailyUsage: () => {
    return db
      .prepare(
        `
        SELECT
          DATE(sent_on) as date,
          SUM(total_recipients) as total
        FROM message_history
        GROUP BY DATE(sent_on)
        ORDER BY date
      `,
      )
      .all();
  },
  getMonthlyUsage: () => {
    return db
      .prepare(
        `
        SELECT
          strftime('%Y-%m', sent_on) as month,
          SUM(total_recipients) as total
        FROM message_history
        GROUP BY month
        ORDER BY month
      `,
      )
      .all();
  },
  getPeakUsageDays: () => {
    return db
      .prepare(
        `
        SELECT
          strftime('%w', sent_on) as weekday,
          SUM(total_recipients) as total
        FROM message_history
        GROUP BY weekday
        ORDER BY total DESC
      `,
      )
      .all();
  },

  getDeliveryOverview: () => {
    const totalSms = db
      .prepare(
        `
        SELECT
          SUM(total_recipients) as total
        FROM message_history
      `,
      )
      .get();

    const failedSms = db
      .prepare(
        `
        SELECT
          SUM(failed_count) as total
        FROM message_history
      `,
      )
      .get();

    return {
      totalSms: totalSms.total || 0,

      failedSms: failedSms.total || 0,

      successSms: (totalSms.total || 0) - (failedSms.total || 0),
    };
  },
  getFailureTrend: () => {
    return db
      .prepare(
        `
        SELECT
          DATE(sent_on) as date,
          SUM(failed_count) as failed
        FROM message_history
        GROUP BY DATE(sent_on)
        ORDER BY date
      `,
      )
      .all();
  },
  getTopCommunicationCategory: () => {
    return db
      .prepare(
        `
      SELECT
        category,
        COUNT(*) as total
      FROM message_history
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `,
      )
      .get();
  },
};
