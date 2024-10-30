import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '@auth/auth.guard';
import { UserId, UserIdParam } from '@common/decorators';
import { FiltersDto } from './dto/filters.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // 레시피 조회(태그 필터링 및 정렬)
  @UseGuards(AuthGuard)
  @Get()
  getAllRecipes(@UserIdParam() userId: UserId, @Query() filters: FiltersDto) {
    return this.recipesService.getAllRecipes(userId, filters);
  }
}
