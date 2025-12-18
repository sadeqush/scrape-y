import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('scraping_jobs')
export class ScrapingJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  sites: string[];

  @Column({
    type: 'text',
    enum: JobStatus,
    default: JobStatus.PENDING,
  })
  @Index()
  status: JobStatus;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'int', default: 0 })
  productsScraped: number;

  @Column({ type: 'int', default: 0 })
  productsUpdated: number;

  @Column({ type: 'int', default: 0 })
  productsCreated: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;
}
