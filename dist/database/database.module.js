"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const scraping_job_entity_1 = require("./entities/scraping-job.entity");
const sync_status_entity_1 = require("./entities/sync-status.entity");
const brand_entity_1 = require("./entities/brand.entity");
const product_repository_1 = require("./repositories/product.repository");
const path = __importStar(require("path"));
const getDatabasePath = () => {
    if (process.env.DB_PATH) {
        return process.env.DB_PATH;
    }
    return path.join(process.cwd(), 'scrape-y.db');
};
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: getDatabasePath(),
                entities: [product_entity_1.Product, scraping_job_entity_1.ScrapingJob, sync_status_entity_1.SyncStatus, brand_entity_1.Brand],
                synchronize: true,
                logging: false,
                prepareDatabase: (db) => {
                    db.pragma('journal_mode = WAL');
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, scraping_job_entity_1.ScrapingJob, sync_status_entity_1.SyncStatus, brand_entity_1.Brand]),
        ],
        providers: [product_repository_1.ProductRepository],
        exports: [typeorm_1.TypeOrmModule, product_repository_1.ProductRepository],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map