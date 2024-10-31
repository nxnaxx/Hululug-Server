import {
  IsArray,
  IsDate,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class WriterDto {
  @IsString()
  nickname: string;

  @IsString()
  profile_image: string;
}

export class ResRecipesDto {
  @IsMongoId()
  recipe_id: Types.ObjectId[];

  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  @IsMongoId({ each: true })
  tags: Types.ObjectId[];

  @IsDate()
  created_at: Date;

  @IsString({ each: true })
  writer: WriterDto;

  @IsNumber()
  likes: number;
}

export class PaginationRecipesDto {
  recipes: ResRecipesDto[];
  next_cursor: string | null;
}
