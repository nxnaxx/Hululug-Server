import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';

export class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;
}

export class ReqRecipeDto {
  @ApiProperty({
    type: String,
    example: '라면과 구공탄',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: [String],
    example: ['60f7e57d92b1fc4c9d234ac2'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    type: String,
    example: '꼬불꼬불 꼬불꼬불 맛좋은 라면',
  })
  @IsString()
  introduce: string;

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
}

export class CreateRecipeDto extends ReqRecipeDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  thumbnail: Express.Multer.File;
}

export class EditRecipeDto extends ReqRecipeDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  thumbnail?: Express.Multer.File;
}
