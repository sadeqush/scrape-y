import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapersController } from './scrapers.controller';
import { ScrapersService } from './scrapers.service';
import { ScraperFactory } from './factories/scraper.factory';
import { StarTechScraper } from './implementations/startech.scraper';
import { RyansScraper } from './implementations/ryans.scraper';
import { TechLandScraper } from './implementations/techland.scraper';
import { Product } from '../database/entities/product.entity';
import { ScrapingJob } from '../database/entities/scraping-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ScrapingJob])],
  controllers: [ScrapersController],
  providers: [
    ScrapersService,
    ScraperFactory,
    StarTechScraper,
    RyansScraper,
    TechLandScraper,
  ],
  exports: [ScrapersService],
})
export class ScrapersModule {}
