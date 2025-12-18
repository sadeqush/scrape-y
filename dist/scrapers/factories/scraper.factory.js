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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperFactory = void 0;
const common_1 = require("@nestjs/common");
const startech_scraper_1 = require("../implementations/startech.scraper");
const ryans_scraper_1 = require("../implementations/ryans.scraper");
const techland_scraper_1 = require("../implementations/techland.scraper");
let ScraperFactory = class ScraperFactory {
    starTechScraper;
    ryansScraper;
    techLandScraper;
    scrapers;
    constructor(starTechScraper, ryansScraper, techLandScraper) {
        this.starTechScraper = starTechScraper;
        this.ryansScraper = ryansScraper;
        this.techLandScraper = techLandScraper;
        this.scrapers = new Map([
            ['startech', this.starTechScraper],
            ['ryans', this.ryansScraper],
            ['techland', this.techLandScraper],
        ]);
    }
    getScraper(site) {
        const scraper = this.scrapers.get(site.toLowerCase());
        if (!scraper) {
            throw new Error(`Scraper not found for site: ${site}. Available: ${Array.from(this.scrapers.keys()).join(', ')}`);
        }
        return scraper;
    }
    getAllScraperNames() {
        return Array.from(this.scrapers.keys());
    }
    hasScraper(site) {
        return this.scrapers.has(site.toLowerCase());
    }
};
exports.ScraperFactory = ScraperFactory;
exports.ScraperFactory = ScraperFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [startech_scraper_1.StarTechScraper,
        ryans_scraper_1.RyansScraper,
        techland_scraper_1.TechLandScraper])
], ScraperFactory);
//# sourceMappingURL=scraper.factory.js.map