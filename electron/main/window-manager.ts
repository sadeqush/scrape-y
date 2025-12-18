import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  constructor(private nestPort: number) {}

  async createMainWindow(): Promise<BrowserWindow> {
    const iconPath = path.join(__dirname, '../../resources/icons/icon.png');
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      minWidth: 1024,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
      title: 'Scrape-Y',
      icon: iconPath,
      show: false, // Don't show until ready
    });

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Load renderer
    if (process.env.NODE_ENV === 'development') {
      // Development: load from Vite dev server
      await this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      // Production: load built files
      await this.mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, '../../renderer/dist/index.html'),
          protocol: 'file:',
          slashes: true,
        }),
      );
    }

    // Store NestJS port for preload script
    (global as any).nestPort = this.nestPort;

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}
