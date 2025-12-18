import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(site?: string, category?: string, inStock?: string, minPrice?: string, maxPrice?: string, search?: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(): Promise<{
        total: number;
        bySite: any[];
    }>;
    findOne(id: string): Promise<Product | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
