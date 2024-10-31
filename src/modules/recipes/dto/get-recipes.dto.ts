import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export type Sort = 'newest' | 'oldest' | 'popular';

export class GetRecipesDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 8;

  @IsMongoId()
  @IsOptional()
  tag?: string;

  @IsEnum(['newest', 'oldest', 'popular'])
  @IsOptional()
  sort?: Sort = 'newest';

  @IsString()
  @IsOptional()
  cursor?: string;
}

export class SearchRecipesDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 8;

  @IsString()
  @IsNotEmpty({ message: '검색어를 입력해 주세요.' })
  keyword: string;

  @IsString()
  @IsOptional()
  cursor?: string;
}
