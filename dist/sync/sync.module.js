"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const sync_controller_1 = require("./sync.controller");
const sync_service_1 = require("./sync.service");
const product_entity_1 = require("../database/entities/product.entity");
const sync_status_entity_1 = require("../database/entities/sync-status.entity");
let SyncModule = class SyncModule {
};
exports.SyncModule = SyncModule;
exports.SyncModule = SyncModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, sync_status_entity_1.SyncStatus]),
            axios_1.HttpModule.register({
                timeout: 30000,
                maxRedirects: 5,
            }),
        ],
        controllers: [sync_controller_1.SyncController],
        providers: [sync_service_1.SyncService],
        exports: [sync_service_1.SyncService],
    })
], SyncModule);
//# sourceMappingURL=sync.module.js.map