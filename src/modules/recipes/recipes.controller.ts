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
  ReqRecipeDto,
  SearchRecipesDto,
  ToggleActionDto,
} from './dto';
import { stringToObjectId } from 'src/utils';

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

  // 상세 레시피 조회
  @Get(':recipe_id')
  async getRecipeDetails(@Param('recipe_id') recipeId: string) {
    return await this.recipesService.getRecipeDetails(
      stringToObjectId(recipeId),
    );
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
    return { recipe_id: createdRecipe._id };
  }

  // 레시피 수정
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Put(':recipe_id')
  async updateRecipe(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() data: ReqRecipeDto,
  ) {
    const recipeData: EditRecipeDto = { ...data, thumbnail };
    await this.recipesService.updateRecipe(
      userId,
      stringToObjectId(recipeId),
      recipeData,
    );
    return;
  }

  // 레시피 삭제
  @UseGuards(AuthGuard)
  @Delete(':recipe_id')
  async deleteRecipe(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
  ) {
    return await this.recipesService.deleteRecipe(
      userId,
      stringToObjectId(recipeId),
    );
  }

  // 레시피 좋아요 추가/취소
  @UseGuards(AuthGuard)
  @Post(':recipe_id/like')
  async toggleLike(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Body() toggleActionDto: ToggleActionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  @UseGuards(AuthGuard)
  @Post(':recipe_id/bookmark')
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
