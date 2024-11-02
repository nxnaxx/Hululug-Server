import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { CommentsService } from './comments.service';
import { UserId, UserIdParam } from '@common/decorators';
import { ReqCommentDto } from './dto/create-comment.dto';
import { stringToObjectId } from 'src/utils';

@Controller('recipes/:recipe_id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
}
