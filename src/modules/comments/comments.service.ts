import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentRepository) {}

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
}
