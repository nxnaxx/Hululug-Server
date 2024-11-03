import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { RecipePreview } from '@modules/recipes';

@Injectable()
export class MyRecipesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RecipePreview.name)
    private recipePreviewModel: Model<RecipePreview>,
  ) {}

  async getUserRecipes(id: string) {
    const user = await this.userModel.findById(id);
    const recipe_preview = await this.recipePreviewModel.find({
      recipe_id: { $in: user.my_recipes },
    });
    return { recipe_preview };
  }
}
