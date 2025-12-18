declare const electronAPI: {
    getServerPort: () => Promise<any>;
    getDbPath: () => Promise<any>;
    openExternal: (url: string) => Promise<any>;
    getAppVersion: () => Promise<any>;
    getUserDataPath: () => Promise<any>;
};
export type ElectronAPI = typeof electronAPI;
export {};
