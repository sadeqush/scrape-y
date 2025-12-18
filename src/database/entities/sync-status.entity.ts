import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum SyncResult {
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILED = 'failed',
}

@Entity('sync_status')
export class SyncStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Index()
  syncedAt: Date;

  @Column({ type: 'int', default: 0 })
  recordsSynced: number;

  @Column({ type: 'int', default: 0 })
  recordsFailed: number;

  @Column({
    type: 'text',
    enum: SyncResult,
    default: SyncResult.SUCCESS,
  })
  status: SyncResult;

  @Column({ type: 'text', nullable: true })
  errorDetails: string;

  @Column({ type: 'simple-json', nullable: true })
  syncedProductIds: string[];

  @Column({ nullable: true })
  remoteServerUrl: string;
}
