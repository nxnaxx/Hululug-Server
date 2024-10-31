import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { GetRecipesDto, SearchRecipesDto } from './dto/get-recipes.dto';

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
}
