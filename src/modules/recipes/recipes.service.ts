import { Injectable } from '@nestjs/common';
import { RecipePreview } from './recipes.schema';
import { RecipeMongoRepository } from './recipes.repository';
import { GetRecipesDto, SearchRecipesDto } from './dto/get-recipes.dto';
import { PaginationRecipesDto, ResRecipesDto } from './dto/res-recipes.dto';
import { decodeQueryParam, stringToObjectId } from 'src/utils';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipeMongoRepository) {}

  private async addWriterInfo(
    recipes: RecipePreview[],
  ): Promise<ResRecipesDto[]> {
    const userPromises = recipes.map(async (recipe) => {
      const { writer, ...rest } = recipe;
      const writerInfo = await this.recipeRepository.findUser(writer);
      return { ...rest, writer: writerInfo };
    });
    return Promise.all(userPromises);
  }

  private generateNextCursor(
    sort: string,
    paginatedRecipes: ResRecipesDto[],
  ): string {
    const lastRecipe = paginatedRecipes[paginatedRecipes.length - 1];
    return sort === 'popular'
      ? `${lastRecipe.likes}_${lastRecipe.created_at.getTime()}`
      : String(lastRecipe.created_at.getTime());
  }

  async getRecipes(query: GetRecipesDto): Promise<PaginationRecipesDto> {
    const { limit, tag, sort, cursor } = query;
    let dbQuery = {};
    let sortOption = {};
    let cursorQuery = {};

    if (tag) dbQuery = { tags: stringToObjectId(tag) };

    if (sort === 'popular') {
      sortOption = { likes: -1, created_at: -1 };
      if (cursor) {
        const [likesCursor, createdAtCursor] = cursor.split('_');
        cursorQuery = {
          $or: [
            { likes: { $lt: parseInt(likesCursor, 10) } }, // 좋아요 수가 cursor보다 적거나
            {
              likes: parseInt(likesCursor, 10),
              created_at: { $lt: new Date(parseInt(createdAtCursor, 10)) }, // 좋아요 수가 cursor와 같고 날짜가 cursor 이전
            },
          ],
        };
      }
    } else if (sort === 'oldest') {
      sortOption = { created_at: 1 };
      if (cursor) {
        cursorQuery = { created_at: { $gt: new Date(parseInt(cursor, 10)) } }; // cursor 날짜보다 이후
      }
    } else {
      sortOption = { created_at: -1 };
      if (cursor) {
        cursorQuery = { created_at: { $lt: new Date(parseInt(cursor, 10)) } }; // cursor 날짜보다 이전
      }
    }

    dbQuery = { ...dbQuery, ...cursorQuery };

    const recipes = await this.recipeRepository.filteredRecipes(
      dbQuery,
      sortOption,
      limit,
    );

    const hasNextPage = recipes.length > limit;
    const paginatedRecipes = await this.addWriterInfo(
      hasNextPage ? recipes.slice(0, -1) : recipes,
    ); // 페이지네이션 시 전달할 데이터 (next cursor가 포함되어 있기 때문에 마지막 요소 제외)
    const nextCursor = hasNextPage
      ? this.generateNextCursor(sort, paginatedRecipes)
      : null;

    return { recipes: paginatedRecipes, next_cursor: nextCursor };
  }

  async searchRecipes(query: SearchRecipesDto): Promise<PaginationRecipesDto> {
    const { limit, keyword, cursor } = query;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { created_at: { $lt: new Date(parseInt(cursor, 10)) } }; // cursor 날짜보다 이전
    }

    const recipes = await this.recipeRepository.findRecipes(
      decodeQueryParam(keyword),
      cursorQuery,
      limit,
    );

    const hasNextPage = recipes.length > limit;
    const paginatedRecipes = await this.addWriterInfo(
      hasNextPage ? recipes.slice(0, -1) : recipes,
    );
    const nextCursor = hasNextPage
      ? this.generateNextCursor('newest', paginatedRecipes)
      : null;

    return { recipes: paginatedRecipes, next_cursor: nextCursor };
  }
}
