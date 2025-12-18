import { ScrapersService } from './scrapers.service';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
import { ScrapingJob } from '../database/entities/scraping-job.entity';
export declare class ScrapersController {
    private readonly scrapersService;
    constructor(scrapersService: ScrapersService);
    scrape(request: ScrapeRequestDto): Promise<ScrapeResponseDto>;
    getAvailableSites(): Promise<{
        sites: string[];
    }>;
    getAllJobs(): Promise<{
        jobs: ScrapingJob[];
    }>;
    getJob(id: string): Promise<ScrapingJob | null>;
}
