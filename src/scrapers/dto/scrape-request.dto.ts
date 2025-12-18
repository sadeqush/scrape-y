import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class ScrapeRequestDto {
  @IsString()
  site: string;

  @IsString()
  brand: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPages?: number;
}
