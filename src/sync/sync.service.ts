import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Product } from '../database/entities/product.entity';
import {
  SyncStatus,
  SyncResult,
} from '../database/entities/sync-status.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private isSyncing = false;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(SyncStatus)
    private readonly syncStatusRepository: Repository<SyncStatus>,
    private readonly httpService: HttpService,
  ) {}

  async triggerSync(force: boolean = false): Promise<SyncStatus> {
    if (this.isSyncing && !force) {
      throw new Error('Sync already in progress');
    }

    this.isSyncing = true;

    try {
      const remoteUrl = process.env.REMOTE_SERVER_URL;

      if (!remoteUrl) {
        throw new Error('REMOTE_SERVER_URL not configured');
      }

      // Get all products
      const unsyncedProducts = await this.productRepository.find();

      if (unsyncedProducts.length === 0) {
        this.logger.log('No products to sync');
        return this.createSyncStatus(0, 0, SyncResult.SUCCESS, [], remoteUrl);
      }

      this.logger.log(`Syncing ${unsyncedProducts.length} products`);

      const batchSize = 100;
      const syncedIds: string[] = [];
      let failedCount = 0;

      // Upload in batches
      for (let i = 0; i < unsyncedProducts.length; i += batchSize) {
        const batch = unsyncedProducts.slice(i, i + batchSize);

        try {
          await firstValueFrom(
            this.httpService.post(`${remoteUrl}/api/products/bulk`, {
              products: batch,
              source: 'scrape-y-desktop',
            }),
          );

          // Track synced IDs
          const batchIds = batch.map((p) => p.id);

          syncedIds.push(...batchIds);
          this.logger.log(`Synced batch ${i / batchSize + 1}`);
        } catch (error) {
          this.logger.error(`Failed to sync batch: ${error.message}`);
          failedCount += batch.length;
        }
      }

      const result =
        failedCount === 0
          ? SyncResult.SUCCESS
          : syncedIds.length > 0
            ? SyncResult.PARTIAL
            : SyncResult.FAILED;

      return this.createSyncStatus(
        syncedIds.length,
        failedCount,
        result,
        syncedIds,
        remoteUrl,
      );
    } finally {
      this.isSyncing = false;
    }
  }

  private async createSyncStatus(
    synced: number,
    failed: number,
    result: SyncResult,
    productIds: string[],
    remoteUrl: string,
    error?: string,
  ): Promise<SyncStatus> {
    const status = this.syncStatusRepository.create({
      recordsSynced: synced,
      recordsFailed: failed,
      status: result,
      syncedProductIds: productIds,
      remoteServerUrl: remoteUrl,
      errorDetails: error,
    });

    return this.syncStatusRepository.save(status);
  }

  async getSyncHistory(limit: number = 20): Promise<SyncStatus[]> {
    return this.syncStatusRepository.find({
      order: { syncedAt: 'DESC' },
      take: limit,
    });
  }

  async getLastSync(): Promise<SyncStatus | null> {
    return this.syncStatusRepository.findOne({
      order: { syncedAt: 'DESC' },
    });
  }

  async getSyncStats() {
    const lastSync = await this.getLastSync();

    return {
      lastSync,
      isSyncing: this.isSyncing,
    };
  }
}
