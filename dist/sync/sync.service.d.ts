import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Product } from '../database/entities/product.entity';
import { SyncStatus } from '../database/entities/sync-status.entity';
export declare class SyncService {
    private readonly productRepository;
    private readonly syncStatusRepository;
    private readonly httpService;
    private readonly logger;
    private isSyncing;
    constructor(productRepository: Repository<Product>, syncStatusRepository: Repository<SyncStatus>, httpService: HttpService);
    triggerSync(force?: boolean): Promise<SyncStatus>;
    private createSyncStatus;
    getSyncHistory(limit?: number): Promise<SyncStatus[]>;
    getLastSync(): Promise<SyncStatus | null>;
    getSyncStats(): Promise<{
        lastSync: SyncStatus | null;
        isSyncing: boolean;
    }>;
}
