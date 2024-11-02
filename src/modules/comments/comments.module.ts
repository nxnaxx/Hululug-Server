import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { User, UserSchema } from '@modules/users/schemas';
import { Recipe, RecipeSchema, RecipesModule } from '@modules/recipes';
import { AuthModule } from '@auth/auth.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentRepository } from './comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    AuthModule,
    RecipesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService, CommentRepository],
})
export class CommentsModule {}
