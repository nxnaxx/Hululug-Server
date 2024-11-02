import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipesService } from './recipes.service';
import { UserId, UserIdParam } from '@common/decorators';
import { RecipeDocument } from './schema/recipe.schema';
import { GetRecipesDto, SearchRecipesDto } from './dto/get-recipes.dto';
import {
  CreateRecipeDto,
  EditRecipeDto,
  ReqRecipeDto,
} from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // 레시피 조회(태그 필터링 및 정렬)
  @Get()
  getRecipes(@Query() query: GetRecipesDto) {
    return this.recipesService.getRecipes(query);
  }

  // 레시피 검색
  @Get('search')
  searchRecipes(@Query() query: SearchRecipesDto) {
    return this.recipesService.searchRecipes(query);
  }

  // 레시피 등록
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post()
  async createRecipe(
    @UserIdParam() userId: UserId,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() data: ReqRecipeDto,
  ) {
    const recipeData: CreateRecipeDto = { ...data, thumbnail };
    const createdRecipe = (await this.recipesService.createRecipe(
      userId,
      recipeData,
    )) as RecipeDocument;

    await this.recipesService.addPreviewRecipe(createdRecipe);
    return;
  }

  // 레시피 수정
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Put(':recipe_id')
  async editRecipe(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() data: ReqRecipeDto,
  ) {
    const recipeData: EditRecipeDto = { ...data, thumbnail };
    await this.recipesService.updateRecipe(userId, recipeId, recipeData);
    return;
  }
}
