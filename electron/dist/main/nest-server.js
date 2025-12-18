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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestServerManager = void 0;
const get_port_1 = __importDefault(require("get-port"));
const path = __importStar(require("path"));
class NestServerManager {
    async start() {
        try {
            // Get available port in range
            this.port = await (0, get_port_1.default)({ port: [3000, 3001, 3002, 3003, 3004, 3005] });
            // Set database path via environment variable
            const { app } = require('electron');
            const dbPath = path.join(app.getPath('userData'), 'scrape-y.db');
            process.env.DB_PATH = dbPath;
            console.log(`Database path: ${dbPath}`);
            console.log(`Starting NestJS server on port ${this.port}...`);
            // Import bootstrap from main.ts
            // In development: electron/dist/main/nest-server.js -> dist/main.js (3 levels up)
            // In production: Same structure
            const mainPath = path.join(__dirname, '../../../dist/main.js');
            console.log(`Loading NestJS from: ${mainPath}`);
            // Use require for CommonJS module
            const mainModule = require(mainPath);
            const bootstrap = mainModule.bootstrap;
            if (!bootstrap) {
                throw new Error('Failed to import bootstrap function from main.ts');
            }
            this.app = await bootstrap(this.port);
            console.log(`NestJS server started successfully on port ${this.port}`);
            return this.port;
        }
        catch (error) {
            console.error('Failed to start NestJS server:', error);
            throw error;
        }
    }
    async stop() {
        if (this.app) {
            console.log('Stopping NestJS server...');
            await this.app.close();
            console.log('NestJS server stopped');
        }
    }
    getApp() {
        return this.app;
    }
    getPort() {
        return this.port;
    }
}
exports.NestServerManager = NestServerManager;
//# sourceMappingURL=nest-server.js.map