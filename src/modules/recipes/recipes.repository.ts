import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecipePreview, RecipeDocument } from './recipes.schema';

export interface RecipeRepository {
  findAllRecipes(): Promise<RecipePreview[]>;
  filteredRecipes(tag: string | null): Promise<RecipePreview[]>;
}

@Injectable()
export class RecipeMongoRepository implements RecipeRepository {
  constructor(
    @InjectModel(RecipePreview.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findAllRecipes(): Promise<RecipePreview[]> {
    return await this.recipeModel.find().lean().exec();
  }

  async filteredRecipes(tag: string | null): Promise<RecipePreview[]> {
    return tag
      ? await this.recipeModel
          .find({ tags: { $in: [new Types.ObjectId(tag)] } })
          .lean()
          .exec()
      : await this.recipeModel.find().lean().exec();
  }
}
