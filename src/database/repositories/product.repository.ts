import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findBySite(site: string, limit?: number): Promise<Product[]> {
    const query = this.createQueryBuilder('product')
      .where('product.site = :site', { site })
      .orderBy('product.scrapedAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }

  async findByBrand(brand: string, limit?: number): Promise<Product[]> {
    const query = this.createQueryBuilder('product')
      .where('product.brand = :brand', { brand })
      .orderBy('product.scrapedAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }

  async findByBrandAndSite(
    brand: string,
    site: string,
    limit?: number,
  ): Promise<Product[]> {
    const query = this.createQueryBuilder('product')
      .where('product.brand = :brand', { brand })
      .andWhere('product.site = :site', { site })
      .orderBy('product.scrapedAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }

  async getStats() {
    const totalProducts = await this.count();

    const productsBySite = await this.createQueryBuilder('product')
      .select('product.site', 'site')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.site')
      .getRawMany();

    const productsByBrand = await this.createQueryBuilder('product')
      .select('product.brand', 'brand')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.brand')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalProducts,
      productsBySite,
      productsByBrand,
    };
  }
}
