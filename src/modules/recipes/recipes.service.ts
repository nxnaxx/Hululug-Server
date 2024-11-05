import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RecipeRepository } from './recipes.repository';
import { AWSService } from '@modules/aws/aws.service';
import { UserId } from '@common/decorators';
import { RecipePreview } from './schema/recipe-preview.schema';
import { Recipe, RecipeDocument } from './schema/recipe.schema';
import {
  decodeQueryParam,
  generateFileHash,
  stringToObjectId,
} from 'src/utils';
import {
  CreateRecipeDto,
  EditRecipeDto,
  GetRecipesDto,
  PaginationRecipesDto,
  ResRecipesDto,
  SearchRecipesDto,
  ToggleAction,
} from './dto';

@Injectable()
export class RecipesService {
  constructor(
    private recipeRepository: RecipeRepository,
    private awsService: AWSService,
  ) {}

  // writer Id 값으로 작성자 정보 추가
  private async addWriterInfo(
    recipes: RecipePreview[],
  ): Promise<ResRecipesDto[]> {
    const userPromises = recipes.map(async (recipe) => {
      const { writer, ...rest } = recipe;
      const { nickname, profile_image } =
        await this.recipeRepository.findUser(writer);
      return { ...rest, writer: { nickname, profile_image } };
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

  // S3에서 기존 파일 삭제
  private async removeThumbFromS3(recipeId: Types.ObjectId) {
    const prevThumbnail = await this.recipeRepository.findThumbnail(recipeId);
    await this.awsService.deleteFileFromS3(
      prevThumbnail.split('/').pop(),
      'recipes',
    );
  }

  // 레시피 목록 조회
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

  // 레시피 검색
  async searchRecipes(query: SearchRecipesDto): Promise<PaginationRecipesDto> {
    const { limit, keyword, cursor } = query;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { created_at: { $lt: new Date(parseInt(cursor, 10)) } }; // cursor 날짜보다 이전
    }

    const recipes = await this.recipeRepository.findRecipesByKeyword(
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

  // 상세 레시피 조회
  async getRecipeDetails(recipeId: Types.ObjectId) {
    const recipe = await this.recipeRepository.findRecipeById(recipeId);
    const writerInfo = await this.recipeRepository.findUser(recipe.writer);

    return { ...recipe, writer: writerInfo };
  }

  // 레시피 등록
  async createRecipe(userId: UserId, data: CreateRecipeDto): Promise<Recipe> {
    const imageUrl = await this.awsService.uploadImgToS3(
      data.thumbnail,
      'recipes',
    );
    const createdRecipe = await this.recipeRepository.saveRecipe({
      ...data,
      thumbnail: imageUrl,
      tags: data.tags.map((id) => stringToObjectId(id)),
      writer: userId,
      likes: 0,
      comments: [],
    });

    await this.recipeRepository.saveMyRecipe(userId, createdRecipe._id);
    return createdRecipe;
  }

  // 레시피 프리뷰 등록
  async addPreviewRecipe(recipe: RecipeDocument): Promise<RecipePreview> {
    const { title, thumbnail, tags, writer, likes, created_at } = recipe;
    const createdRecipe = {
      recipe_id: recipe._id,
      title,
      thumbnail,
      tags,
      writer,
      likes,
      created_at,
    };

    return await this.recipeRepository.savePreview(createdRecipe);
  }

  // 레시피 수정
  async updateRecipe(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
    data: EditRecipeDto,
  ) {
    const hash = generateFileHash(data.thumbnail.buffer);
    const s3Url = this.awsService.getS3Url(hash, 'recipes');
    const hasSameThumbnail = await this.recipeRepository.hasSameThumbnail(
      recipeId,
      s3Url,
    );
    const { thumbnail, ...rest } = data;
    let updateData = {};

    if (hasSameThumbnail) updateData = rest;
    else {
      const imageUrl = await this.awsService.uploadImgToS3(
        data.thumbnail,
        'recipes',
      );
      await this.removeThumbFromS3(recipeId);
      updateData = { ...rest, thumbnail: imageUrl };
    }

    return await this.recipeRepository.updateRecipe(
      userId,
      recipeId,
      updateData as EditRecipeDto,
    );
  }

  // 레시피 삭제
  async deleteRecipe(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    await this.recipeRepository.checkRecipeExists(recipeId, userId);
    await Promise.all([
      this.removeThumbFromS3(recipeId),
      this.recipeRepository.deleteRecipe(userId, recipeId),
      this.recipeRepository.deleteMyRecipe(userId, recipeId),
    ]);
    return;
  }

  // 레시피 좋아요
  async toggleLike(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
    action: ToggleAction,
  ): Promise<{ likes: number }> {
    return action === 'add'
      ? await this.recipeRepository.addLike(userId, recipeId)
      : await this.recipeRepository.removeLike(userId, recipeId);
  }

  // 레시피 북마크
  async toggleBookmark(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
    action: ToggleAction,
  ): Promise<void> {
    return action === 'add'
      ? await this.recipeRepository.addBookmark(userId, recipeId)
      : await this.recipeRepository.removeBookmark(userId, recipeId);
  }
}
