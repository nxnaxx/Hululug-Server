import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { User } from '@modules/users/schemas';
import { Recipe, RecipeRepository } from '@modules/recipes';
import { UserId } from '@common/decorators';
import { CommentWriterDto, CommentDBQueryDto, DeleteQueryDto } from './dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async saveComment(data: Comment): Promise<Comment> {
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

  async findWriter(userId: Types.ObjectId): Promise<CommentWriterDto> {
    const user = await this.userModel
      .findOne({ _id: userId }, { _id: 0, nickname: 1, profile_image: 1 })
      .lean()
      .exec();

    if (!user) {
      return {
        nickname: '익명',
        profile_image:
          'https://dr4twgka8dxga.cloudfront.net/profile/3ed5d0f311178bec20bb5263c42b81f3954ace60c6e718b10c84507d8d0ade04',
      };
    }

    return user;
  }

  async findComments(recipeId: Types.ObjectId): Promise<Comment[]> {
    return await this.commentModel
      .find({ recipe_id: recipeId })
      .sort({ created_at: 1 })
      .select({ recipe_id: 0 })
      .lean()
      .exec();
  }

  async updateComment(
    query: CommentDBQueryDto,
    content: string,
  ): Promise<Comment[]> {
    const { comment_id, recipe_id, writer } = query;
    const commentExists = await this.commentModel.findOne({
      _id: comment_id,
      recipe_id: recipe_id,
      writer: writer,
    });

    if (!commentExists) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (commentExists.content === content) {
      throw new HttpException(
        { status: 200, message: '댓글 변경 사항 없음' },
        200,
      );
    }

    return await this.commentModel.findOneAndUpdate(
      { _id: comment_id },
      { content: content },
      { new: true, select: { writer: 0, recipe_id: 0, created_at: 0 } },
    );
  }

  // 댓글 삭제
  async removeComment(query: DeleteQueryDto) {
    const comment = await this.commentModel.findById(query.comment_id);

    if (!comment) {
      throw new NotFoundException('삭제할 댓글이 존재하지 않습니다.');
    }

    if (comment.writer === query.writer) {
      throw new ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentModel.deleteOne({ _id: query.comment_id });
    return;
  }

  // 내 댓글 삭제
  async removeMyComment(query: DeleteQueryDto): Promise<void> {
    const { writer, comment_id } = query;
    await this.userModel.findByIdAndUpdate(writer, {
      $pull: { my_comments: comment_id },
    });
    return;
  }
}
