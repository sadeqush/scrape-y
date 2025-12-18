import { INestApplication } from '@nestjs/common';
export declare class NestServerManager {
    private app;
    private port;
    start(): Promise<number>;
    stop(): Promise<void>;
    getApp(): INestApplication;
    getPort(): number;
}
