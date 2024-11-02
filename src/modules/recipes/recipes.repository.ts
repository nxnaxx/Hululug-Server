import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { RecipePreview } from './schema/recipe-preview.schema';
import { Recipe } from './schema/recipe.schema';
import { User } from '@modules/users/schemas';
import { WriterDto } from './dto/res-recipes.dto';
import { EditRecipeDto } from './dto';

export interface RecipeRepository {
  filteredRecipes(
    dbQuery: object,
    sortOption: object,
    limit: number,
  ): Promise<RecipePreview[]>;
  findRecipes(
    keyword: string,
    dbQuery: object,
    limit: number,
  ): Promise<RecipePreview[]>;
  findUser(
    userId: Types.ObjectId,
  ): Promise<{ nickname: string; profile_image: string } | null>;
  insertRecipe(recipes: Recipe): Promise<Recipe>;
}

@Injectable()
export class RecipeMongoRepository implements RecipeRepository {
  constructor(
    @InjectModel(RecipePreview.name) private previewModel: Model<RecipePreview>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async filteredRecipes(
    dbQuery: object,
    sortOption: { [key: string]: SortOrder },
    limit: number,
  ): Promise<RecipePreview[]> {
    return await this.previewModel
      .find(dbQuery)
      .sort(sortOption)
      .limit(limit + 1) // nestCursor 위해서 +1
      .lean()
      .exec();
  }

  async findRecipes(
    keyword: string,
    dbQuery: { created_at: { $lt: number } } | {},
    limit: number,
  ): Promise<RecipePreview[]> {
    const keywords = keyword.trim().split(/\s+/);
    const regexes = keywords.map((keyword) => ({
      title: new RegExp(keyword, 'i'),
    }));

    return await this.previewModel
      .find({ $and: [...regexes, dbQuery] })
      .sort({ created_at: -1 })
      .limit(limit + 1) // nestCursor 위해서 +1
      .lean()
      .exec();
  }

  async findUser(userId: Types.ObjectId): Promise<WriterDto | null> {
    return await this.userModel
      .findOne(
        { _id: userId },
        { _id: 0, nickname: 1, profile_image: 1, introduce: 1 },
      )
      .lean()
      .exec();
  }

  async insertRecipe(recipes: Recipe): Promise<Recipe> {
    return await new this.recipeModel(recipes).save();
  }

  async insertPreview(recipes: RecipePreview): Promise<RecipePreview> {
    return await new this.previewModel(recipes).save();
  }

  // 동일한 thumbnail이 존재하는지 여부
  async hasSameThumbnail(recipeId: Types.ObjectId, thumbnailUrl: string) {
    return await this.recipeModel
      .findOne({ _id: recipeId, thumbnail: thumbnailUrl })
      .lean()
      .exec();
  }

  // 레시피 ID로 thumbnail url 검색
  async findThumbnail(recipeId: Types.ObjectId) {
    const recipe = await this.recipeModel
      .findOne({ _id: recipeId })
      .select('thumbnail -_id')
      .lean()
      .exec();
    return recipe.thumbnail;
  }

  // 레시피 수정
  async updateRecipe(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
    data: EditRecipeDto,
  ) {
    const updatedRecipe = await this.recipeModel.findOneAndUpdate(
      { _id: recipeId, writer: userId },
      { ...data },
    );

    if (!updatedRecipe) {
      throw new NotFoundException(
        '레시피가 존재하지 않거나 수정 권한이 없습니다.',
      );
    }

    const { introduce, ingredients, cooking_steps, ...rest } = data;
    await this.previewModel.findOneAndUpdate(
      { recipe_id: recipeId, writer: userId },
      { ...rest },
    );

    return;
  }
}
