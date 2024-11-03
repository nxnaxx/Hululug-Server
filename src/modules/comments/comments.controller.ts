import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { CommentsService } from './comments.service';
import { UserId, UserIdParam } from '@common/decorators';
import { ReqCommentDto } from './dto';
import { stringToObjectId } from 'src/utils';

@Controller('recipes/:recipe_id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 등록
  @UseGuards(AuthGuard)
  @Post()
  create(
    @UserIdParam() userId: UserId,
    @Param('recipe_id') recipeId: string,
    @Body() data: ReqCommentDto,
  ) {
    const { content } = data;
    return this.commentsService.createComment(stringToObjectId(recipeId), {
      userId,
      content,
    });
  }

  // 댓글 목록 조회
  @Get()
  findOne(@Param('recipe_id') recipeId: string) {
    return this.commentsService.getComments(stringToObjectId(recipeId));
  }
}
