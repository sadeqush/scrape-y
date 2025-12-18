import { INestApplication } from '@nestjs/common';
import getPort from 'get-port';
import * as path from 'path';

export class NestServerManager {
  private app!: INestApplication;
  private port!: number;

  async start(): Promise<number> {
    try {
      // Get available port in range
      this.port = await getPort({ port: [3000, 3001, 3002, 3003, 3004, 3005] });

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
    } catch (error) {
      console.error('Failed to start NestJS server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.app) {
      console.log('Stopping NestJS server...');
      await this.app.close();
      console.log('NestJS server stopped');
    }
  }

  getApp(): INestApplication {
    return this.app;
  }

  getPort(): number {
    return this.port;
  }
}
