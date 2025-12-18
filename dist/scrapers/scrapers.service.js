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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScrapersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scraper_factory_1 = require("./factories/scraper.factory");
const product_entity_1 = require("../database/entities/product.entity");
const scraping_job_entity_1 = require("../database/entities/scraping-job.entity");
let ScrapersService = ScrapersService_1 = class ScrapersService {
    scraperFactory;
    productRepository;
    jobRepository;
    logger = new common_1.Logger(ScrapersService_1.name);
    constructor(scraperFactory, productRepository, jobRepository) {
        this.scraperFactory = scraperFactory;
        this.productRepository = productRepository;
        this.jobRepository = jobRepository;
    }
    async startScraping(request) {
        const uniqueSites = Array.from(new Set(request.sites));
        if (!uniqueSites.length) {
            throw new Error('At least one site must be provided');
        }
        const invalidSites = uniqueSites.filter((site) => !this.scraperFactory.hasScraper(site));
        if (invalidSites.length) {
            throw new Error(`Invalid sites: ${invalidSites.join(', ')}`);
        }
        const job = this.jobRepository.create({
            sites: uniqueSites,
            brand: request.brand,
            status: scraping_job_entity_1.JobStatus.PENDING,
            metadata: { request },
        });
        await this.jobRepository.save(job);
        this.executeScraping(job, request).catch((error) => {
            this.logger.error(`Scraping job ${job.id} failed: ${error.message}`, error.stack);
        });
        return {
            jobId: job.id,
            sites: job.sites,
            status: scraping_job_entity_1.JobStatus.PENDING,
            message: 'Scraping job started',
            startedAt: job.startedAt,
        };
    }
    async executeScraping(job, request) {
        try {
            job.status = scraping_job_entity_1.JobStatus.RUNNING;
            await this.jobRepository.save(job);
            let totalCreated = 0;
            let totalUpdated = 0;
            let totalScraped = 0;
            const maxPages = request.maxPages || 2;
            for (const site of job.sites) {
                this.logger.log(`Starting to scrape brand "${request.brand}" from ${site}`);
                const scraper = this.scraperFactory.getScraper(site);
                const products = await scraper.searchByBrand(request.brand, maxPages);
                totalScraped += products.length;
                for (const productData of products) {
                    const result = await this.saveProduct(productData);
                    if (result === 'created')
                        totalCreated++;
                    if (result === 'updated')
                        totalUpdated++;
                }
                this.logger.log(`Completed scraping ${products.length} products from ${site}`);
            }
            job.status = scraping_job_entity_1.JobStatus.COMPLETED;
            job.completedAt = new Date();
            job.productsScraped = totalScraped;
            job.productsCreated = totalCreated;
            job.productsUpdated = totalUpdated;
            await this.jobRepository.save(job);
            this.logger.log(`Scraping completed: ${totalScraped} products (${totalCreated} new, ${totalUpdated} updated)`);
        }
        catch (error) {
            job.status = scraping_job_entity_1.JobStatus.FAILED;
            job.errorMessage = error.message;
            job.completedAt = new Date();
            await this.jobRepository.save(job);
            throw error;
        }
    }
    async saveProduct(productData) {
        const product = this.productRepository.create(productData);
        await this.productRepository.save(product);
        return 'created';
    }
    async getJob(jobId) {
        return this.jobRepository.findOne({ where: { id: jobId } });
    }
    async getAllJobs(limit = 10000) {
        return this.jobRepository.find({
            order: { startedAt: 'DESC' },
            take: limit,
        });
    }
    async getAvailableSites() {
        return this.scraperFactory.getAllScraperNames();
    }
};
exports.ScrapersService = ScrapersService;
exports.ScrapersService = ScrapersService = ScrapersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(scraping_job_entity_1.ScrapingJob)),
    __metadata("design:paramtypes", [scraper_factory_1.ScraperFactory,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ScrapersService);
//# sourceMappingURL=scrapers.service.js.map