import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
export declare class ProductRepository extends Repository<Product> {
    private dataSource;
    constructor(dataSource: DataSource);
    findBySite(site: string, limit?: number): Promise<Product[]>;
    findByBrand(brand: string, limit?: number): Promise<Product[]>;
    findByBrandAndSite(brand: string, site: string, limit?: number): Promise<Product[]>;
    getStats(): Promise<{
        totalProducts: number;
        productsBySite: any[];
        productsByBrand: any[];
    }>;
}
