import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserId } from '@common/decorators';
import { FiltersDto } from './dto/filters.dto';
import { RecipePreview } from './recipes.schema';
import { RecipeMongoRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipeMongoRepository) {}

  private isRecipeBookmarked(recipe: RecipePreview, userId: UserId): boolean {
    if (!userId) return false;
    return recipe.bookmarks.some(
      (bookmark) =>
        bookmark.toString() === new Types.ObjectId(userId).toString(),
    );
  }

  private addBookmarkStatus(recipes: RecipePreview[], userId: UserId) {
    return recipes.map((recipe) => {
      const { bookmarks, ...rest } = recipe;
      return {
        ...rest,
        is_bookmarked: this.isRecipeBookmarked(recipe, userId),
      };
    });
  }

  async getAllRecipes(userId: UserId, filters: FiltersDto) {
    const { tag, sort } = filters;
    const recipes = await this.recipeRepository.filteredRecipes(tag);

    recipes.sort((a, b) => {
      if (sort === 'oldest')
        return a.created_at.getTime() - b.created_at.getTime();
      else if (sort === 'popular') return b.likes - a.likes;
      return b.created_at.getTime() - a.created_at.getTime();
    });

    const newRecipeData = this.addBookmarkStatus(recipes, userId);

    return { recipes: newRecipeData };
  }
}
