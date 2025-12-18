import { app, BrowserWindow } from 'electron';
import { NestServerManager } from './nest-server';
import { WindowManager } from './window-manager';
import { registerIpcHandlers } from './ipc-handlers';

let nestServer: NestServerManager;
let windowManager: WindowManager;

async function initialize() {
  try {
    console.log('Initializing Scrape-Y...');

    // Start NestJS server
    nestServer = new NestServerManager();
    const port = await nestServer.start();

    // Register IPC handlers
    registerIpcHandlers();

    // Create main window
    windowManager = new WindowManager(port);
    await windowManager.createMainWindow();

    console.log('Scrape-Y initialized successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
    app.quit();
  }
}

// App lifecycle
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    nestServer.stop();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.createMainWindow();
  }
});

app.on('before-quit', async () => {
  if (nestServer) {
    await nestServer.stop();
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
