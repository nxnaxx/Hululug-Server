import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { User } from '@modules/users/schemas';
import { Recipe, RecipeRepository } from '@modules/recipes';
import { UserId } from '@common/decorators';
import { WriterDto } from '@modules/recipes/dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async saveComment(data: Comment): Promise<CommentDocument> {
    // 레시피 존재하는지 확인
    await this.recipeRepository.checkRecipeExists(data.recipe_id);

    const comment = await new this.commentModel(data).save();
    await this.recipeModel.findByIdAndUpdate(data.recipe_id, {
      $push: { comments: comment._id },
    });
    return comment;
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

  async findWriter(userId: Types.ObjectId): Promise<WriterDto> {
    return await this.userModel
      .findOne({ _id: userId }, { _id: 0, nickname: 1, profile_image: 1 })
      .lean()
      .exec();
  }
}
