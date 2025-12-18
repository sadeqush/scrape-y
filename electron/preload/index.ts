import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to renderer
const electronAPI = {
  getServerPort: () => ipcRenderer.invoke('get-server-port'),
  getDbPath: () => ipcRenderer.invoke('get-db-path'),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// TypeScript type declarations for window.electronAPI
export type ElectronAPI = typeof electronAPI;
