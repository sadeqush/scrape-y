import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../database/entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find({
      order: { name: 'ASC' },
    });
  }

  async create(name: string): Promise<Brand> {
    // Check if brand already exists
    const existing = await this.brandRepository.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Brand "${name}" already exists`);
    }

    const brand = this.brandRepository.create({ name });
    return this.brandRepository.save(brand);
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.brandRepository.findOne({ where: { name } });
  }
}
