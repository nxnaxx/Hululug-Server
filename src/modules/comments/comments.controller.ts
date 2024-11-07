import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Patch,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { CommentsService } from './comments.service';
import { UserId, UserIdParam } from '@common/decorators';
import { CommentParamsDto, ReqCommentDto } from './dto';
import { stringToObjectId } from 'src/utils';

@Controller('recipes/:recipe_id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 등록
  @UseGuards(AuthGuard)
  @Post()
  async createComment(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Body() data: ReqCommentDto,
  ) {
    const { content } = data;
    return await this.commentsService.createComment(
      stringToObjectId(recipeId),
      {
        userId,
        content,
      },
    );
  }

  // 댓글 목록 조회
  @Get()
  async getComments(@Param('recipe_id') recipeId: string) {
    return await this.commentsService.getComments(stringToObjectId(recipeId));
  }

  // 댓글 수정
  @UseGuards(AuthGuard)
  @Patch(':comment_id')
  async editComment(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Param('comment_id') commentId: string,
    @Body() data: ReqCommentDto,
  ) {
    const query = {
      writer: userId,
      recipe_id: stringToObjectId(recipeId),
      comment_id: stringToObjectId(commentId),
    };

    return await this.commentsService.editComment(query, data.content);
  }

  // 댓글 삭제
  @UseGuards(AuthGuard)
  @Delete(':comment_id')
  async deleteComment(
    @UserIdParam() userId: UserId,
    @Param() deleteCommentDto: CommentParamsDto,
  ) {
    const { recipe_id, comment_id } = deleteCommentDto;
    const query = {
      writer: userId,
      recipe_id,
      comment_id,
    };
    return await this.commentsService.deleteComment(query);
  }
}
