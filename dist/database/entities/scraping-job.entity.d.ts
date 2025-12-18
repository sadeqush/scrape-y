export declare enum JobStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class ScrapingJob {
    id: string;
    site: string;
    status: JobStatus;
    brand: string;
    productsScraped: number;
    productsUpdated: number;
    productsCreated: number;
    errorMessage: string;
    startedAt: Date;
    completedAt: Date;
    metadata: Record<string, any>;
}
