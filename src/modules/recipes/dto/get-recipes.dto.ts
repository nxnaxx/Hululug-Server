import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: false,
    type: Number,
    description: '한 번에 불러올 데이터 수',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 8;

  @ApiProperty({
    required: false,
    type: String,
    description: '태그 ID',
  })
  @IsMongoId()
  @IsOptional()
  tag?: string;

  @ApiProperty({
    required: false,
    enum: ['newest', 'oldest', 'popular'],
    description: '정렬 순서',
  })
  @IsEnum(['newest', 'oldest', 'popular'])
  @IsOptional()
  sort?: Sort = 'newest';

  @ApiProperty({
    required: false,
    type: String,
    nullable: true,
    description: '페이지네이션 다음 커서',
  })
  @IsString()
  @IsOptional()
  cursor?: string;
}

export class SearchRecipesDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '검색 키워드',
  })
  @IsString()
  @IsNotEmpty({ message: '검색어를 입력해 주세요.' })
  keyword: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: '한 번에 불러올 데이터 수',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 8;

  @ApiProperty({
    required: false,
    type: String,
    nullable: true,
    description: '페이지네이션 다음 커서',
  })
  @IsString()
  @IsOptional()
  cursor?: string;
}
