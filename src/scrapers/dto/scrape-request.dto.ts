import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class ScrapeRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  sites: string[];

  @IsString()
  brand: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPages?: number;
}
