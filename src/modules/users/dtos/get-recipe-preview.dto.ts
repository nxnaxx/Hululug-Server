import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

class RecipePreviewDto {
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
    type: String,
    example: '672cebd284e1d325614c233d',
  })
  @IsString()
  writer: string;
}

export class GetRecipePreviewDto {
  @ApiProperty({
    type: [RecipePreviewDto],
  })
  recipe_preview: [RecipePreviewDto];
}
