"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const scrapers_controller_1 = require("./scrapers.controller");
const scrapers_service_1 = require("./scrapers.service");
const scraper_factory_1 = require("./factories/scraper.factory");
const startech_scraper_1 = require("./implementations/startech.scraper");
const ryans_scraper_1 = require("./implementations/ryans.scraper");
const techland_scraper_1 = require("./implementations/techland.scraper");
const product_entity_1 = require("../database/entities/product.entity");
const scraping_job_entity_1 = require("../database/entities/scraping-job.entity");
let ScrapersModule = class ScrapersModule {
};
exports.ScrapersModule = ScrapersModule;
exports.ScrapersModule = ScrapersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, scraping_job_entity_1.ScrapingJob])],
        controllers: [scrapers_controller_1.ScrapersController],
        providers: [
            scrapers_service_1.ScrapersService,
            scraper_factory_1.ScraperFactory,
            startech_scraper_1.StarTechScraper,
            ryans_scraper_1.RyansScraper,
            techland_scraper_1.TechLandScraper,
        ],
        exports: [scrapers_service_1.ScrapersService],
    })
], ScrapersModule);
//# sourceMappingURL=scrapers.module.js.map