import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';

export interface ProductFilters {
  site?: string;
  brand?: string;
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 10000,
  ): Promise<{ products: Product[]; total: number }> {
    const query = this.productRepository.createQueryBuilder('product');

    if (filters.site) {
      query.andWhere('product.site = :site', { site: filters.site });
    }

    if (filters.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }

    if (filters.brand) {
      query.andWhere('product.brand = :brand', {
        brand: filters.brand,
      });
    }

    if (filters.inStock !== undefined) {
      query.andWhere('product.inStock = :inStock', {
        inStock: filters.inStock,
      });
    }

    if (filters.minPrice) {
      query.andWhere('product.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      query.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.search) {
      query.andWhere('product.name LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    const total = await query.getCount();
    const products = await query
      .orderBy('product.scrapedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { products, total };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async getStats() {
    const total = await this.productRepository.count();

    const bySite = await this.productRepository
      .createQueryBuilder('product')
      .select('product.site', 'site')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.site')
      .getRawMany();

    return {
      total,
      bySite,
    };
  }
}
