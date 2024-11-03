import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { RecipePreview } from '@modules/recipes';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RecipePreview.name)
    private recipePreviewModel: Model<RecipePreview>,
  ) {}

  async getUserBookmark(id: string) {
    const user = await this.userModel.findById(id);
    const recipe_preview = await this.recipePreviewModel
      .find({
        recipe_id: { $in: user.bookmark },
      })
      .lean();
    return { recipe_preview };
  }
}
