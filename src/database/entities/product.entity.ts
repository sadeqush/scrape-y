import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
@Index(['site', 'brand'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  @Index()
  brand: string;

  @Column()
  @Index()
  site: string; // 'startech' | 'ryans' | 'techland'

  @CreateDateColumn()
  scrapedAt: Date;
}
