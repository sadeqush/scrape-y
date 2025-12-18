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
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(filters?: ProductFilters, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
    }>;
    findOne(id: string): Promise<Product | null>;
    remove(id: string): Promise<void>;
    getStats(): Promise<{
        total: number;
        bySite: any[];
    }>;
}
