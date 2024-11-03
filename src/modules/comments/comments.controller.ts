import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { CommentsService } from './comments.service';
import { UserId, UserIdParam } from '@common/decorators';
import { ReqCommentDto } from './dto';
import { stringToObjectId } from 'src/utils';

export class NoContentException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.NO_CONTENT,
        message: message || 'No Content',
      },
      HttpStatus.NO_CONTENT,
    );
  }
}

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
}
