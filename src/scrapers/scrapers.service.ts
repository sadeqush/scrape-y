import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScraperFactory } from './factories/scraper.factory';
import { Product } from '../database/entities/product.entity';
import {
  ScrapingJob,
  JobStatus,
} from '../database/entities/scraping-job.entity';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
import { ProductData } from './interfaces/scraper.interface';

@Injectable()
export class ScrapersService {
  private readonly logger = new Logger(ScrapersService.name);

  constructor(
    private readonly scraperFactory: ScraperFactory,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ScrapingJob)
    private readonly jobRepository: Repository<ScrapingJob>,
  ) {}

  async startScraping(
    request: ScrapeRequestDto,
  ): Promise<ScrapeResponseDto> {
    // Validate scraper exists
    if (!this.scraperFactory.hasScraper(request.site)) {
      throw new Error(`Invalid site: ${request.site}`);
    }

    // Create job
    const job = this.jobRepository.create({
      site: request.site,
      brand: request.brand,
      status: JobStatus.PENDING,
      metadata: { request },
    });
    await this.jobRepository.save(job);

    // Start scraping in background
    this.executeScraping(job, request).catch((error) => {
      this.logger.error(
        `Scraping job ${job.id} failed: ${error.message}`,
        error.stack,
      );
    });

    return {
      jobId: job.id,
      site: request.site,
      status: JobStatus.PENDING,
      message: 'Scraping job started',
      startedAt: job.startedAt,
    };
  }

  private async executeScraping(
    job: ScrapingJob,
    request: ScrapeRequestDto,
  ): Promise<void> {
    try {
      // Update job status
      job.status = JobStatus.RUNNING;
      await this.jobRepository.save(job);

      // Clear all existing products before starting new scrape
      this.logger.log('Clearing existing products from database');
      await this.productRepository.clear();

      const scraper = this.scraperFactory.getScraper(request.site);

      this.logger.log(
        `Starting to scrape brand "${request.brand}" from ${request.site}`,
      );

      const maxPages = request.maxPages || 2;
      const products = await scraper.searchByBrand(request.brand, maxPages);

      let totalCreated = 0;
      let totalUpdated = 0;

      // Save products to database
      for (const productData of products) {
        const result = await this.saveProduct(productData);
        if (result === 'created') totalCreated++;
        if (result === 'updated') totalUpdated++;
      }

      const totalScraped = products.length;

      // Mark job as completed
      job.status = JobStatus.COMPLETED;
      job.completedAt = new Date();
      job.productsScraped = totalScraped;
      job.productsCreated = totalCreated;
      job.productsUpdated = totalUpdated;
      await this.jobRepository.save(job);

      this.logger.log(
        `Scraping completed: ${totalScraped} products (${totalCreated} new, ${totalUpdated} updated)`,
      );
    } catch (error) {
      // Mark job as failed
      job.status = JobStatus.FAILED;
      job.errorMessage = error.message;
      job.completedAt = new Date();
      await this.jobRepository.save(job);

      throw error;
    }
  }

  private async saveProduct(
    productData: ProductData,
  ): Promise<'created' | 'updated'> {
    // Always create a new record with current timestamp
    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);
    return 'created';
  }

  async getJob(jobId: string): Promise<ScrapingJob | null> {
    return this.jobRepository.findOne({ where: { id: jobId } });
  }

  async getAllJobs(limit: number = 10000): Promise<ScrapingJob[]> {
    return this.jobRepository.find({
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  async getAvailableSites(): Promise<string[]> {
    return this.scraperFactory.getAllScraperNames();
  }
}
