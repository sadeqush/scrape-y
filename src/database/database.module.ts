import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ScrapingJob } from './entities/scraping-job.entity';
import { SyncStatus } from './entities/sync-status.entity';
import { Brand } from './entities/brand.entity';
import { ProductRepository } from './repositories/product.repository';
import * as path from 'path';

// Get database path - will be set by Electron main process or use local path for development
const getDatabasePath = (): string => {
  // In Electron, this will be set via environment variable by the main process
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }

  // Development mode - use local directory
  return path.join(process.cwd(), 'scrape-y.db');
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: getDatabasePath(),
      entities: [Product, ScrapingJob, SyncStatus, Brand],
      synchronize: true, // Auto-create tables (use migrations in production)
      logging: false, // Disabled query logging
      // Enable WAL mode for better concurrency
      prepareDatabase: (db) => {
        db.pragma('journal_mode = WAL');
      },
    }),
    TypeOrmModule.forFeature([Product, ScrapingJob, SyncStatus, Brand]),
  ],
  providers: [ProductRepository],
  exports: [TypeOrmModule, ProductRepository],
})
export class DatabaseModule {}
