import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { Comment } from '@modules/comments';
import { RecipePreview } from '@modules/recipes';

@Injectable()
export class MyCommentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    @InjectModel(RecipePreview.name)
    private recipePreviewModel: Model<RecipePreview>,
  ) {}

  async getUserComments(id: string) {
    const user = await this.userModel.findById(id);
    const comments = await this.commentModel
      .find({
        _id: { $in: user.my_comments },
      })
      .lean();
    const commentData = await Promise.all(
      comments.map(async (comment) => {
        const recipe = await this.recipePreviewModel.findOne({
          recipe_id: comment.recipe_id,
        });
        return {
          comment_info: comment,
          recipe_title: recipe.title,
        };
      }),
    );

    return { comments: commentData };
  }
}
