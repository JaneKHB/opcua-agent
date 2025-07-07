import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 개발 중일 경우 localhost, 배포 시엔 file://
  const startUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;
  await win.loadURL(startUrl);

  win.webContents.openDevTools();   // 창이 열릴 때 자동으로 콘솔 띄우기
}

app.whenReady().then(createWindow);