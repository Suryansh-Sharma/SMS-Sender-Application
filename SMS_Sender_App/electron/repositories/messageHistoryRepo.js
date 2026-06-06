import { db } from "../db/db.js";
const allowedSortFields = [
  "sent_on",
  "failed_counts",
  "total_recipients",
  "category",
];
export const messageHistoryRepo = {
  save: ({ campaign_id, category, message, total_recipients, total_token_used, failed_count, status, springedge_group_id, sent_by }) => {
    return db.prepare(`
      INSERT INTO message_history
        (campaign_id, category, message, total_recipients, total_token_used, failed_count, status, springedge_group_id, sent_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(campaign_id, category, message, total_recipients, total_token_used, failed_count, status, springedge_group_id ?? null, sent_by ?? null);
  },

  getTodaySentCount: () => {
    return db.prepare(
      `SELECT COALESCE(SUM(total_recipients), 0) as total
       FROM message_history
       WHERE date(sent_on, 'localtime') = date('now', 'localtime')`
    ).get().total;
  },

  updateDelivery: ({ campaign_id, delivered_count }) => {
    return db.prepare(
      `UPDATE message_history SET delivered_count = ? WHERE campaign_id = ?`
    ).run(delivered_count, campaign_id);
  },

  getPaginated: ({
    page = 1,
    limit = 10,
    sortBy = "sent_on",
    sortOrder = "DESC",
  }) => {
    const offset = (page - 1) * limit;

    // Validate Sort Field.
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "sent_on";
    }

    // Validate Sort Order.
    sortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Fetch Data.
    const query = `
      SELECT *
      FROM message_history
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    const data = db.prepare(query).all(limit, offset);

    // Total Count.
    const total = db
      .prepare(`SELECT COUNT(*) as count FROM message_history`)
      .get().count;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
