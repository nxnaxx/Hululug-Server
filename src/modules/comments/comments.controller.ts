import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { CommentsService } from './comments.service';
import { UserId, UserIdParam } from '@common/decorators';
import {
  CommentParamsDto,
  GetCommentDto,
  ReqCommentDto,
  UpdatedCommentDto,
} from './dto';
import { stringToObjectId } from 'src/utils';
import { ApiCookieAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('recipes/:recipe_id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 등록
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Post()
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '댓글 작성 대상 레시피 ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: GetCommentDto,
  })
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
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '댓글 조회 대상 레시피 ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [GetCommentDto],
  })
  async getComments(
    @Param('recipe_id') recipeId: string,
  ): Promise<GetCommentDto[]> {
    return await this.commentsService.getComments(stringToObjectId(recipeId));
  }

  // 댓글 수정
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Patch(':comment_id')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '댓글이 속한 레시피 ID',
  })
  @ApiParam({
    name: 'comment_id',
    type: String,
    description: '수정할 댓글 ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdatedCommentDto,
  })
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
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  @Delete(':comment_id')
  @ApiParam({
    name: 'recipe_id',
    type: String,
    description: '댓글이 속한 레시피 ID',
  })
  @ApiParam({
    name: 'comment_id',
    type: String,
    description: '삭제할 댓글 ID',
  })
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
