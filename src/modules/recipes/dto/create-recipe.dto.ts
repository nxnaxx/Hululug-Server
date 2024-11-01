import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;
}

export class ReqRecipeDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  introduce: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @IsString({ each: true })
  cooking_steps: string[];
}

export class CreateRecipeDto extends ReqRecipeDto {
  thumbnail: Express.Multer.File;
}
