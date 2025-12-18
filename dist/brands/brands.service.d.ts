import { Repository } from 'typeorm';
import { Brand } from '../database/entities/brand.entity';
export declare class BrandsService {
    private readonly brandRepository;
    constructor(brandRepository: Repository<Brand>);
    findAll(): Promise<Brand[]>;
    create(name: string): Promise<Brand>;
    findByName(name: string): Promise<Brand | null>;
}
