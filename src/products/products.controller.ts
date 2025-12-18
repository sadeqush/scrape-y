import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService, ProductFilters } from './products.service';
import { Product } from '../database/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('site') site?: string,
    @Query('category') category?: string,
    @Query('inStock') inStock?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10000,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const filters: ProductFilters = {
      site,
      category,
      inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search,
    };

    const result = await this.productsService.findAll(filters, page, limit);

    return {
      ...result,
      page,
      limit,
    };
  }

  @Get('stats')
  async getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}
