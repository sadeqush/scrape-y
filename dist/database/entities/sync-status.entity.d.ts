export declare enum SyncResult {
    SUCCESS = "success",
    PARTIAL = "partial",
    FAILED = "failed"
}
export declare class SyncStatus {
    id: string;
    syncedAt: Date;
    recordsSynced: number;
    recordsFailed: number;
    status: SyncResult;
    errorDetails: string;
    syncedProductIds: string[];
    remoteServerUrl: string;
}
