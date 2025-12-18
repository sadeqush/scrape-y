export interface ElectronAPI {
  getServerPort: () => Promise<number>;
  getDbPath: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;
  getAppVersion: () => Promise<string>;
  getUserDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
