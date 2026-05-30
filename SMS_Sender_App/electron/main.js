import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { registerUserHandlers } from "./controllers/registerUserHandlers.js";
import { registerMessageHistoryHandlers } from "./controllers/messageHistoryHandler.js";

import { intAdmin } from "./db/initAdmin.js";
import { statsHandler } from "./controllers/statsHandler.js";
import { settingHandler } from "./controllers/settingHandlers.js";
import { smsHandler } from "./controllers/smsHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.setName("SMS Sender Pro");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../build/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);

    // optional devtools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(async () => {
  try {
    // init default admin
    await intAdmin();

    // register IPC handlers
    registerUserHandlers();
    registerMessageHistoryHandlers();
    statsHandler();
    settingHandler();
    smsHandler();

    // create app window
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (err) {
    console.error("App startup failed:", err);
  }
});

// macOS behavior
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
