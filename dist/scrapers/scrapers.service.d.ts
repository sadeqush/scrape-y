import { Repository } from 'typeorm';
import { ScraperFactory } from './factories/scraper.factory';
import { Product } from '../database/entities/product.entity';
import { ScrapingJob } from '../database/entities/scraping-job.entity';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
export declare class ScrapersService {
    private readonly scraperFactory;
    private readonly productRepository;
    private readonly jobRepository;
    private readonly logger;
    constructor(scraperFactory: ScraperFactory, productRepository: Repository<Product>, jobRepository: Repository<ScrapingJob>);
    startScraping(request: ScrapeRequestDto): Promise<ScrapeResponseDto>;
    private executeScraping;
    private saveProduct;
    getJob(jobId: string): Promise<ScrapingJob | null>;
    getAllJobs(limit?: number): Promise<ScrapingJob[]>;
    getAvailableSites(): Promise<string[]>;
}
