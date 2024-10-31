import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserId } from '@common/decorators';
import { FiltersDto } from './dto/filters.dto';
import { RecipePreview } from './recipes.schema';
import { RecipeMongoRepository } from './recipes.repository';
import { decodeQueryParam, stringToObjectId } from 'src/utils';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipeMongoRepository) {}

  private isRecipeBookmarked(recipe: RecipePreview, userId: UserId): boolean {
    if (!userId) return false;
    return recipe.bookmarks.some(
      (bookmark) => bookmark.toString() === stringToObjectId(userId).toString(),
    );
  }

  private async createPreviewData(recipes: RecipePreview[], userId: UserId) {
    const userPromises = recipes.map(async (recipe) => {
      const { bookmarks, writer, ...rest } = recipe;
      const user = await this.recipeRepository.findUser(writer);

      return {
        ...rest,
        writer: user,
        is_bookmarked: this.isRecipeBookmarked(recipe, userId),
      };
    });

    return Promise.all(userPromises);
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

    const newRecipeData = await this.createPreviewData(recipes, userId);

    return { recipes: newRecipeData };
  }

  async searchRecipes(userId: UserId, title: string) {
    const recipes = await this.recipeRepository.findRecipes(
      decodeQueryParam(title),
    );

    const newRecipeData = await this.createPreviewData(recipes, userId);

    return { recipes: newRecipeData };
  }
}
