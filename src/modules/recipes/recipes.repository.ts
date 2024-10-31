import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { RecipePreview } from './recipes.schema';
import { User } from '@modules/users/schemas';
import { WriterDto } from './dto/res-recipes.dto';

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
}

@Injectable()
export class RecipeMongoRepository implements RecipeRepository {
  constructor(
    @InjectModel(RecipePreview.name) private recipeModel: Model<RecipePreview>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async filteredRecipes(
    dbQuery: object,
    sortOption: { [key: string]: SortOrder },
    limit: number,
  ): Promise<RecipePreview[]> {
    return await this.recipeModel
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

    return await this.recipeModel
      .find({ $and: [...regexes, dbQuery] })
      .sort({ created_at: -1 })
      .limit(limit + 1) // nestCursor 위해서 +1
      .lean()
      .exec();
  }

  async findUser(userId: Types.ObjectId): Promise<WriterDto | null> {
    return await this.userModel
      .findOne({ _id: userId }, { _id: 0, nickname: 1, profile_image: 1 })
      .lean()
      .exec();
  }
}
