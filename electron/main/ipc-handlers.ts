import { ipcMain, shell, app } from 'electron';
import * as path from 'path';

export function registerIpcHandlers() {
  // Get NestJS server port
  ipcMain.handle('get-server-port', () => {
    return (global as any).nestPort;
  });

  // Get database path
  ipcMain.handle('get-db-path', () => {
    return path.join(app.getPath('userData'), 'scrape-y.db');
  });

  // Open external URL in default browser
  ipcMain.handle('open-external', async (event, url: string) => {
    await shell.openExternal(url);
    return true;
  });

  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Get user data path
  ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData');
  });

  console.log('IPC handlers registered');
}
