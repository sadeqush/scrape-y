import { StarTechScraper } from '../implementations/startech.scraper';
import { RyansScraper } from '../implementations/ryans.scraper';
import { TechLandScraper } from '../implementations/techland.scraper';
import { BaseScraper } from '../base/base-scraper';
export declare class ScraperFactory {
    private readonly starTechScraper;
    private readonly ryansScraper;
    private readonly techLandScraper;
    private scrapers;
    constructor(starTechScraper: StarTechScraper, ryansScraper: RyansScraper, techLandScraper: TechLandScraper);
    getScraper(site: string): BaseScraper;
    getAllScraperNames(): string[];
    hasScraper(site: string): boolean;
}
