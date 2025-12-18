import { SyncService } from './sync.service';
import { SyncStatus } from '../database/entities/sync-status.entity';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    triggerSync(force?: string): Promise<SyncStatus>;
    getHistory(): Promise<{
        history: SyncStatus[];
    }>;
    getStatus(): Promise<{
        lastSync: SyncStatus | null;
        isSyncing: boolean;
    }>;
}
