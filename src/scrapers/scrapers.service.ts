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

  async startScraping(request: ScrapeRequestDto): Promise<ScrapeResponseDto> {
    const uniqueSites = Array.from(new Set(request.sites));
    if (!uniqueSites.length) {
      throw new Error('At least one site must be provided');
    }

    const invalidSites = uniqueSites.filter(
      (site) => !this.scraperFactory.hasScraper(site),
    );
    if (invalidSites.length) {
      throw new Error(`Invalid sites: ${invalidSites.join(', ')}`);
    }

    // Create job
    const job = this.jobRepository.create({
      sites: uniqueSites,
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
      sites: job.sites,
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

      let totalCreated = 0;
      let totalUpdated = 0;
      let totalScraped = 0;
      const maxPages = request.maxPages || 2;

      for (const site of job.sites) {
        this.logger.log(
          `Starting to scrape brand "${request.brand}" from ${site}`,
        );

        const scraper = this.scraperFactory.getScraper(site);
        const products = await scraper.searchByBrand(request.brand, maxPages);
        totalScraped += products.length;

        // Save products to database
        for (const productData of products) {
          const result = await this.saveProduct(productData);
          if (result === 'created') totalCreated++;
          if (result === 'updated') totalUpdated++;
        }

        this.logger.log(
          `Completed scraping ${products.length} products from ${site}`,
        );
      }

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
