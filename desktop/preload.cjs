/**
 * BioBuild Evidence Lab - Windows Desktop Preload Bridge
 * 
 * Secure contextIsolation bridge exposing native capabilities.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  isDesktop: true,
  platform: process.platform,
  getSystemInfo: () => ipcRenderer.invoke('desktop:get-system-info'),
  openExternal: (url) => ipcRenderer.invoke('desktop:open-external', url),
  onAction: (callback) => {
    ipcRenderer.on('desktop:action', (event, action) => callback(action));
  },
  onNavigate: (callback) => {
    ipcRenderer.on('desktop:navigate', (event, route) => callback(route));
  }
});
