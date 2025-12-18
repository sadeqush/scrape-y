import { Controller, Post, Get, Query } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncStatus } from '../database/entities/sync-status.entity';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('trigger')
  async triggerSync(@Query('force') force?: string): Promise<SyncStatus> {
    return this.syncService.triggerSync(force === 'true');
  }

  @Get('history')
  async getHistory(): Promise<{ history: SyncStatus[] }> {
    const history = await this.syncService.getSyncHistory();
    return { history };
  }

  @Get('status')
  async getStatus() {
    return this.syncService.getSyncStats();
  }
}
