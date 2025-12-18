"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const product_entity_1 = require("../database/entities/product.entity");
const sync_status_entity_1 = require("../database/entities/sync-status.entity");
const rxjs_1 = require("rxjs");
let SyncService = SyncService_1 = class SyncService {
    productRepository;
    syncStatusRepository;
    httpService;
    logger = new common_1.Logger(SyncService_1.name);
    isSyncing = false;
    constructor(productRepository, syncStatusRepository, httpService) {
        this.productRepository = productRepository;
        this.syncStatusRepository = syncStatusRepository;
        this.httpService = httpService;
    }
    async triggerSync(force = false) {
        if (this.isSyncing && !force) {
            throw new Error('Sync already in progress');
        }
        this.isSyncing = true;
        try {
            const remoteUrl = process.env.REMOTE_SERVER_URL;
            if (!remoteUrl) {
                throw new Error('REMOTE_SERVER_URL not configured');
            }
            const unsyncedProducts = await this.productRepository.find();
            if (unsyncedProducts.length === 0) {
                this.logger.log('No products to sync');
                return this.createSyncStatus(0, 0, sync_status_entity_1.SyncResult.SUCCESS, [], remoteUrl);
            }
            this.logger.log(`Syncing ${unsyncedProducts.length} products`);
            const batchSize = 100;
            const syncedIds = [];
            let failedCount = 0;
            for (let i = 0; i < unsyncedProducts.length; i += batchSize) {
                const batch = unsyncedProducts.slice(i, i + batchSize);
                try {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${remoteUrl}/api/products/bulk`, {
                        products: batch,
                        source: 'scrape-y-desktop',
                    }));
                    const batchIds = batch.map((p) => p.id);
                    syncedIds.push(...batchIds);
                    this.logger.log(`Synced batch ${i / batchSize + 1}`);
                }
                catch (error) {
                    this.logger.error(`Failed to sync batch: ${error.message}`);
                    failedCount += batch.length;
                }
            }
            const result = failedCount === 0
                ? sync_status_entity_1.SyncResult.SUCCESS
                : syncedIds.length > 0
                    ? sync_status_entity_1.SyncResult.PARTIAL
                    : sync_status_entity_1.SyncResult.FAILED;
            return this.createSyncStatus(syncedIds.length, failedCount, result, syncedIds, remoteUrl);
        }
        finally {
            this.isSyncing = false;
        }
    }
    async createSyncStatus(synced, failed, result, productIds, remoteUrl, error) {
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
    async getSyncHistory(limit = 20) {
        return this.syncStatusRepository.find({
            order: { syncedAt: 'DESC' },
            take: limit,
        });
    }
    async getLastSync() {
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
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(sync_status_entity_1.SyncStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService])
], SyncService);
//# sourceMappingURL=sync.service.js.map