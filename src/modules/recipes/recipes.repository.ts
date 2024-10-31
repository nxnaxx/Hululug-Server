import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecipePreview, RecipeDocument } from './recipes.schema';
import { User } from '@modules/users/schemas';
import { stringToObjectId } from 'src/utils';

export interface RecipeRepository {
  findAllRecipes(): Promise<RecipePreview[]>;
  filteredRecipes(tag: string | null): Promise<RecipePreview[]>;
  findRecipes(searchValue: string): Promise<RecipePreview[]>;
}

@Injectable()
export class RecipeMongoRepository implements RecipeRepository {
  constructor(
    @InjectModel(RecipePreview.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAllRecipes(): Promise<RecipePreview[]> {
    return await this.recipeModel.find({}).lean().exec();
  }

  async filteredRecipes(tag: string | null): Promise<RecipePreview[]> {
    return tag
      ? await this.recipeModel
          .find({ tags: { $in: [stringToObjectId(tag)] } })
          .lean()
          .exec()
      : await this.recipeModel.find().lean().exec();
  }

  async findRecipes(searchValue: string): Promise<RecipePreview[]> {
    const keywords = searchValue.trim().split(/\s+/);
    const regexes = keywords.map((keyword) => ({
      title: new RegExp(keyword, 'i'),
    }));

    return await this.recipeModel.find({ $and: regexes }).lean().exec();
  }

  async findUser(
    userId: Types.ObjectId,
  ): Promise<{ nickname: string; profile_image: string } | null> {
    return await this.userModel
      .findOne({ _id: userId }, { _id: 0, nickname: 1, profile_image: 1 })
      .lean()
      .exec();
  }
}
