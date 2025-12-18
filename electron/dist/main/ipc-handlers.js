"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpcHandlers = registerIpcHandlers;
const electron_1 = require("electron");
const path = __importStar(require("path"));
function registerIpcHandlers() {
    // Get NestJS server port
    electron_1.ipcMain.handle('get-server-port', () => {
        return global.nestPort;
    });
    // Get database path
    electron_1.ipcMain.handle('get-db-path', () => {
        return path.join(electron_1.app.getPath('userData'), 'scrape-y.db');
    });
    // Open external URL in default browser
    electron_1.ipcMain.handle('open-external', async (event, url) => {
        await electron_1.shell.openExternal(url);
        return true;
    });
    // Get app version
    electron_1.ipcMain.handle('get-app-version', () => {
        return electron_1.app.getVersion();
    });
    // Get user data path
    electron_1.ipcMain.handle('get-user-data-path', () => {
        return electron_1.app.getPath('userData');
    });
    console.log('IPC handlers registered');
}
//# sourceMappingURL=ipc-handlers.js.map