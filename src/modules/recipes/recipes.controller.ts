import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipesService } from './recipes.service';
import { UserId, UserIdParam } from '@common/decorators';
import { RecipeDocument } from './schema/recipe.schema';
import {
  CreateRecipeDto,
  EditRecipeDto,
  GetRecipesDto,
  PaginationRecipesDto,
  RecipeIdResDto,
  RecipeLikesResDto,
  ReqRecipeDto,
  ResRecipeDetailsDto,
  SearchRecipesDto,
  ToggleActionDto,
} from './dto';
import { stringToObjectId } from 'src/utils';
import { ApiBody, ApiCookieAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // 레시피 조회(태그 필터링 및 정렬)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: PaginationRecipesDto,
  })
  getRecipes(@Query() query: GetRecipesDto) {
    return this.recipesService.getRecipes(query);
  }

  // 레시피 검색
  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: PaginationRecipesDto,
  })
  searchRecipes(@Query() query: SearchRecipesDto) {
    return this.recipesService.searchRecipes(query);
  }

  // 상세 레시피 조회
  @Get(':recipe_id')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '조회할 레시피 ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResRecipeDetailsDto,
  })
  async getRecipeDetails(@Param('recipe_id') recipeId: string) {
    return await this.recipesService.getRecipeDetails(
      stringToObjectId(recipeId),
    );
  }

  // 레시피 등록
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post()
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: RecipeIdResDto,
  })
  async createRecipe(
    @UserIdParam() userId: UserId,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() data: ReqRecipeDto,
  ): Promise<RecipeIdResDto> {
    const parsedIngredients = data.ingredients.map((ingredient) =>
      typeof ingredient === 'string' ? JSON.parse(ingredient) : ingredient,
    );
    const recipeData: CreateRecipeDto = {
      ...data,
      ingredients: parsedIngredients,
      thumbnail,
    };

    const createdRecipe = (await this.recipesService.createRecipe(
      userId,
      recipeData,
    )) as RecipeDocument;
    await this.recipesService.addPreviewRecipe(createdRecipe);
    return { recipe_id: createdRecipe._id };
  }

  // 레시피 수정
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Put(':recipe_id')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '수정할 레시피 ID',
  })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async updateRecipe(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() data: ReqRecipeDto,
  ): Promise<void> {
    const parsedIngredients = data.ingredients.map((ingredient) =>
      typeof ingredient === 'string' ? JSON.parse(ingredient) : ingredient,
    );
    const recipeData: EditRecipeDto = {
      ...data,
      ingredients: parsedIngredients,
      thumbnail,
    };

    await this.recipesService.updateRecipe(
      userId,
      stringToObjectId(recipeId),
      recipeData,
    );
    return;
  }

  // 레시피 삭제
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Delete(':recipe_id')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '삭제할 레시피 ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async deleteRecipe(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
  ): Promise<void> {
    return await this.recipesService.deleteRecipe(
      userId,
      stringToObjectId(recipeId),
    );
  }

  // 레시피 좋아요 추가/취소
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Post(':recipe_id/like')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '좋아요 대상 레시피 ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: RecipeLikesResDto,
  })
  async toggleLike(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Body() toggleActionDto: ToggleActionDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RecipeLikesResDto> {
    const { action } = toggleActionDto;
    if (action === 'add') {
      res.locals.customMessage = '좋아요를 추가했습니다.';
    } else if (action === 'remove') {
      res.locals.customMessage = '좋아요를 취소했습니다.';
    } else throw new BadRequestException('유효하지 않은 요청입니다.');

    return await this.recipesService.toggleLike(
      userId,
      stringToObjectId(recipeId),
      action,
    );
  }

  // 레시피 북마크 추가/취소
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Post(':recipe_id/bookmark')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '북마크 대상 레시피 ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  async toggleBookmark(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Body() toggleActionDto: ToggleActionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { action } = toggleActionDto;
    if (action === 'add') {
      res.locals.customMessage = '북마크를 추가했습니다.';
    } else if (action === 'remove') {
      res.locals.customMessage = '북마크를 취소했습니다.';
    } else throw new BadRequestException('유효하지 않은 요청입니다.');

    return await this.recipesService.toggleBookmark(
      userId,
      stringToObjectId(recipeId),
      action,
    );
  }
}
