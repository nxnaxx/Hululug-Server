import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientDto } from './create-recipe.dto';

export class WriterDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  profile_image: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  introduce?: string;
}

export class ResRecipesDto {
  @ApiProperty({
    type: String,
    example: '672cedcc84e1d324114c234c',
  })
  @IsMongoId()
  _id?: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '672cedcb84e1d115614c2340',
  })
  @IsMongoId()
  recipe_id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '라면과 구공탄',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    example: 'https://dr4twgka8dxga.cloudfront.net/recipes/231414125123123214',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    type: [String],
    example: ['6721aa427e7f8b2e11d49d4b'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  tags: Types.ObjectId[];

  @ApiProperty({
    type: Number,
    example: 20,
  })
  @IsNumber()
  likes: number;

  @ApiProperty({
    type: Date,
    example: '2024-11-07T12:00:00.763Z',
  })
  @IsString()
  created_at?: Date;

  @ApiProperty({
    type: WriterDto,
    example: {
      nickname: '조림요정',
      profile_image:
        'https://dr4twgka8dxga.cloudfront.net/recipes/231414125123123214',
    },
  })
  @IsString({ each: true })
  writer: WriterDto;
}

export class PaginationRecipesDto {
  @ApiProperty({
    type: [ResRecipesDto],
  })
  recipes: ResRecipesDto[];

  @ApiProperty({
    type: String,
    example: '1730980529231',
  })
  next_cursor: string | null;
}

export class RecipeIdResDto {
  @ApiProperty({ type: String, example: '12345678ab9c10d1112ef1g3' })
  @IsMongoId()
  recipe_id: Types.ObjectId;
}

export class ResRecipeDetailsDto {
  @ApiProperty({
    type: String,
    example: '672cedcc84e1d324114c234c',
  })
  @IsMongoId()
  _id?: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '라면과 구공탄',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    example: 'https://dr4twgka8dxga.cloudfront.net/recipes/231414125123123214',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    type: [String],
    example: ['6721aa427e7f8b2e11d49d4b'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  tags: Types.ObjectId[];

  @ApiProperty({
    type: String,
    example: '뽀글뽀글 뽀글뽀글 맛좋은 라면',
  })
  @IsString()
  introduce: string;

  @ApiProperty({
    type: WriterDto,
    example: {
      nickname: '조림요정',
      introduce: '뭐든 다 조림',
      profile_image:
        'https://dr4twgka8dxga.cloudfront.net/recipes/231414125123123214',
    },
  })
  @IsString({ each: true })
  writer: WriterDto;

  @ApiProperty({
    type: [IngredientDto],
    example: [
      { name: '정수물', unit: '500ml' },
      { name: '라면', unit: '1개' },
    ],
  })
  @IsArray()
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({
    type: [String],
    example: [
      '물을 끓이고 라면과 라면스프 넣는다.',
      '3분 후에 익으면 접시에 담아 맛있게 먹는다.',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  cooking_steps: string[];

  @ApiProperty({
    type: Number,
    example: 20,
  })
  @IsNumber()
  likes: number;

  @ApiProperty({
    type: String,
    example: '2024-11-07T12:00:00.763Z',
  })
  @IsString()
  created_at?: Date;

  @ApiProperty({
    type: String,
    example: '2024-11-08T12:00:00.763Z',
  })
  @IsString()
  updated_at?: Date;
}

export class RecipeLikesResDto {
  @ApiProperty({ type: Number, example: 20 })
  @IsNumber()
  likes: number;
}
