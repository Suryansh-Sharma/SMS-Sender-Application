import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

const dbPath = path.join(app.getPath("userData"), "app.db");
export const db = new Database(dbPath);

console.log("DB Path:", dbPath);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    password TEXT,
    role TEXT DEFAULT 'USER',
    is_active INTEGER DEFAULT 1,
    change_password INTEGER DEFAULT 1,
    joined_on DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS message_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  total_recipients INTEGER NOT NULL,
  total_token_used INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'SENT',
  springedge_group_id TEXT,
  sent_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_by TEXT
);`,
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS app_setting(
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  smsApiKey     TEXT,
  senderId      TEXT,
  smsUrl        TEXT,
  orgName       TEXT,
  orgPhone      TEXT,
  orgEmail      TEXT,
  orgAddress    TEXT,
  dailySmsLimit INTEGER DEFAULT 5000,
  appVersion    TEXT,
  appInstalledOn DATETIME DEFAULT CURRENT_TIMESTAMP,
  settingsLastUpdatedOn DATETIME,
  settingsLastUpdatedBy TEXT
)

  `,
).run();
