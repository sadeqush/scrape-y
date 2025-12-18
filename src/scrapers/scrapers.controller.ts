import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
import { ScrapingJob } from '../database/entities/scraping-job.entity';

@Controller('scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Post('scrape')
  async scrape(
    @Body(ValidationPipe) request: ScrapeRequestDto,
  ): Promise<ScrapeResponseDto> {
    return this.scrapersService.startScraping(request);
  }

  @Get('sites')
  async getAvailableSites(): Promise<{ sites: string[] }> {
    const sites = await this.scrapersService.getAvailableSites();
    return { sites };
  }

  @Get('jobs')
  async getAllJobs(): Promise<{ jobs: ScrapingJob[] }> {
    const jobs = await this.scrapersService.getAllJobs();
    return { jobs };
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string): Promise<ScrapingJob | null> {
    return this.scrapersService.getJob(id);
  }
}
