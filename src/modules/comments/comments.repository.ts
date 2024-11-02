import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { User } from '@modules/users/schemas';
import { Recipe, RecipeRepository } from '@modules/recipes';
import { UserId } from '@common/decorators';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async saveComment(data: Comment): Promise<Types.ObjectId> {
    // 레시피 존재하는지 확인
    await this.recipeRepository.checkRecipeExists(data.recipe_id);

    const commentId = (await new this.commentModel(data).save())._id;
    await this.recipeModel.findByIdAndUpdate(data.recipe_id, {
      $push: { comments: commentId },
    });
    return commentId;
  }

  async saveMyComment(
    userId: UserId,
    commentId: Types.ObjectId,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { my_comments: commentId },
    });
    return;
  }
}
