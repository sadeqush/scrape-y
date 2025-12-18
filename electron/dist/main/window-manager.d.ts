import { BrowserWindow } from 'electron';
export declare class WindowManager {
    private nestPort;
    private mainWindow;
    constructor(nestPort: number);
    createMainWindow(): Promise<BrowserWindow>;
    getMainWindow(): BrowserWindow | null;
}
