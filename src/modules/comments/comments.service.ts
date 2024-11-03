import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentRepository } from './comments.repository';
import { Comment } from './schema/comment.schema';
import { CreateCommentDto, GetCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentRepository) {}

  private async addWriterInfo(comments: Comment[]): Promise<GetCommentDto[]> {
    const commentPromises = comments.map(async (comment) => {
      const { writer, ...rest } = comment;
      const { nickname, profile_image } =
        await this.commentRepository.findWriter(writer);
      return { ...rest, writer: { nickname, profile_image } };
    });
    return Promise.all(commentPromises);
  }

  async createComment(
    recipeId: Types.ObjectId,
    createCommentDto: CreateCommentDto,
  ) {
    const { userId, content } = createCommentDto;
    const newCommentData = {
      recipe_id: recipeId,
      writer: userId,
      content,
    };

    const comment = await this.commentRepository.saveComment(newCommentData);
    await this.commentRepository.saveMyComment(userId, comment._id);

    const writerInfo = await this.commentRepository.findWriter(userId);

    return {
      _id: comment._id,
      writer: { ...writerInfo },
      content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    };
  }

  async getComments(recipeId: Types.ObjectId) {
    const comments = await this.commentRepository.findComments(recipeId);
    return await this.addWriterInfo(comments);
  }
}
