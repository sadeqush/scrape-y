"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const nest_server_1 = require("./nest-server");
const window_manager_1 = require("./window-manager");
const ipc_handlers_1 = require("./ipc-handlers");
let nestServer;
let windowManager;
async function initialize() {
    try {
        console.log('Initializing Scrape-Y...');
        // Start NestJS server
        nestServer = new nest_server_1.NestServerManager();
        const port = await nestServer.start();
        // Register IPC handlers
        (0, ipc_handlers_1.registerIpcHandlers)();
        // Create main window
        windowManager = new window_manager_1.WindowManager(port);
        await windowManager.createMainWindow();
        console.log('Scrape-Y initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize:', error);
        electron_1.app.quit();
    }
}
// App lifecycle
electron_1.app.whenReady().then(initialize);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        nestServer.stop();
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        windowManager.createMainWindow();
    }
});
electron_1.app.on('before-quit', async () => {
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
//# sourceMappingURL=index.js.map