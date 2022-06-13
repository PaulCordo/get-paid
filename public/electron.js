const { app, BrowserWindow, screen } = require("electron");
const api = require("./electron.api");

const path = require("path");
const isDev = require("electron-is-dev");

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().size.width * 0.9,
    height: screen.getPrimaryDisplay().size.height * 0.9,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    show: false,
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  isDev && mainWindow.webContents.openDevTools();
  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  api(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
