import { IsOptional, IsString } from 'class-validator';

export type Sort = 'newest' | 'oldest' | 'popular';

export class FiltersDto {
  @IsString()
  @IsOptional()
  tag: string;

  @IsString()
  @IsOptional()
  sort: Sort;
}
