import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { Product } from '../database/entities/product.entity';
import { SyncStatus } from '../database/entities/sync-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, SyncStatus]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
