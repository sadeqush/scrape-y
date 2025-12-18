import { Injectable } from '@nestjs/common';
import { StarTechScraper } from '../implementations/startech.scraper';
import { RyansScraper } from '../implementations/ryans.scraper';
import { TechLandScraper } from '../implementations/techland.scraper';
import { BaseScraper } from '../base/base-scraper';

@Injectable()
export class ScraperFactory {
  private scrapers: Map<string, BaseScraper>;

  constructor(
    private readonly starTechScraper: StarTechScraper,
    private readonly ryansScraper: RyansScraper,
    private readonly techLandScraper: TechLandScraper,
  ) {
    this.scrapers = new Map<string, BaseScraper>([
      ['startech', this.starTechScraper],
      ['ryans', this.ryansScraper],
      ['techland', this.techLandScraper],
    ]);
  }

  getScraper(site: string): BaseScraper {
    const scraper = this.scrapers.get(site.toLowerCase());

    if (!scraper) {
      throw new Error(
        `Scraper not found for site: ${site}. Available: ${Array.from(
          this.scrapers.keys(),
        ).join(', ')}`,
      );
    }

    return scraper;
  }

  getAllScraperNames(): string[] {
    return Array.from(this.scrapers.keys());
  }

  hasScraper(site: string): boolean {
    return this.scrapers.has(site.toLowerCase());
  }
}
