/**
 * BioBuild Evidence Lab - Windows Desktop Application Entry Point
 * 
 * Electron Main Process for Windows (x64 / arm64)
 * Alive Houses AS
 */

const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let serverProcess = null;
const DEFAULT_PORT = 3000;
const SIGNAL_PORT = 8888;

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function isServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startBackendServer() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.cjs');
  console.log('[BioBuild Desktop] Starter lokal Express backend:', serverPath);

  try {
    serverProcess = spawn(process.execPath || 'node', [serverPath], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production', PORT: String(DEFAULT_PORT) },
      stdio: 'ignore'
    });

    serverProcess.on('error', (err) => {
      console.warn('[BioBuild Desktop] Kunne ikke starte frittstående node-prosess:', err.message);
    });
  } catch (e) {
    console.warn('[BioBuild Desktop] Feil under oppstart av backend:', e);
  }
}

async function waitForServer(port, maxTries = 25) {
  for (let i = 0; i < maxTries; i++) {
    const running = await isServerRunning(port);
    if (running) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'BioBuild Evidence Lab - Windows Desktop Edition',
    backgroundColor: '#f6f5ee',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  const appUrl = `http://localhost:${DEFAULT_PORT}`;

  mainWindow.loadURL(appUrl).catch((err) => {
    console.error('[BioBuild Desktop] Kunne ikke laste URL:', err);
    // Fallback: load local HTML if server isn't ready
    const fallbackPath = path.join(__dirname, '..', 'dist', 'index.html');
    mainWindow.loadFile(fallbackPath).catch(() => {});
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupAppMenu();
}

function setupAppMenu() {
  const template = [
    {
      label: 'Fil',
      submenu: [
        {
          label: 'Nytt Bio-Materiale',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('desktop:action', 'new-material');
          }
        },
        {
          label: 'Eksporter Forskningsdata (JSON)',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('desktop:action', 'export-json');
          }
        },
        { type: 'separator' },
        {
          label: 'Lukk BioBuild',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Unreal Bridge',
      submenu: [
        {
          label: 'Åpne Unreal 5.4 & MetaHuman Eva',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('desktop:navigate', 'unreal');
          }
        },
        {
          label: 'Kjør Windows Pixel Streaming (Win Inst)',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('desktop:action', 'run-win-inst');
          }
        },
        {
          label: 'Sjekk Pixel Streaming Port 8888',
          click: () => {
            shell.openExternal(`http://127.0.0.1:${SIGNAL_PORT}`);
          }
        }
      ]
    },
    {
      label: 'Visning',
      submenu: [
        { role: 'reload', label: 'Last inn på nytt' },
        { role: 'forceReload', label: 'Tvungen oppdatering' },
        { role: 'toggleDevTools', label: 'Utviklerverktøy' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Tilbakestill zoom' },
        { role: 'zoomIn', label: 'Zoom inn' },
        { role: 'zoomOut', label: 'Zoom ut' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Fullskjerm' }
      ]
    },
    {
      label: 'Hjelp',
      submenu: [
        {
          label: 'BioBuild Dokumentasjon',
          click: () => shell.openExternal('https://alivehouses.no')
        },
        {
          label: 'Windows Installasjonsveiledning',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('desktop:action', 'show-installer-hub');
          }
        },
        { type: 'separator' },
        {
          label: 'Om BioBuild Evidence Lab Desktop',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Om BioBuild Evidence Lab',
              message: 'BioBuild Evidence Lab - Windows Desktop Edition v1.0.0',
              detail: 'Kunnskaps- og forskningsmotor bak Alive Houses.\nStøtter Unreal Engine 5.4.3 Pixel Streaming, MetaHuman Eva og akkrediterte laboratorietester.\n\nUtviklet for Windows 10/11 x64.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('desktop:get-system-info', () => {
  return {
    isDesktop: true,
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron || '29.0.0',
    nodeVersion: process.version,
    port: DEFAULT_PORT,
    signalPort: SIGNAL_PORT
  };
});

ipcMain.handle('desktop:open-external', (event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

app.whenReady().then(async () => {
  const running = await isServerRunning(DEFAULT_PORT);
  if (!running) {
    startBackendServer();
    await waitForServer(DEFAULT_PORT);
  }

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
