"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods to renderer
const electronAPI = {
    getServerPort: () => electron_1.ipcRenderer.invoke('get-server-port'),
    getDbPath: () => electron_1.ipcRenderer.invoke('get-db-path'),
    openExternal: (url) => electron_1.ipcRenderer.invoke('open-external', url),
    getAppVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
    getUserDataPath: () => electron_1.ipcRenderer.invoke('get-user-data-path'),
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
//# sourceMappingURL=index.js.map