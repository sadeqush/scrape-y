import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    findAll(): Promise<import("../database/entities/brand.entity").Brand[]>;
    create(createBrandDto: CreateBrandDto): Promise<import("../database/entities/brand.entity").Brand>;
}
