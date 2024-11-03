import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import { HttpModule } from '@nestjs/axios';
import {
  GetUrlService,
  SignUpService,
  SignInService,
  SignOutService,
  UpdateUserService,
  SignOffService,
  BookmarkService,
  MyRecipesService,
  MyCommentsService,
} from './services';
import { AuthModule } from '@auth/auth.module';
import { AWSModule } from '@modules/aws/aws.module';
import { PreviewSchema, RecipePreview } from '@modules/recipes';
import { Comment, CommentSchema } from '@modules/comments';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RecipePreview.name, schema: PreviewSchema },
    ]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    HttpModule,
    AuthModule,
    AWSModule,
  ],
  controllers: [UsersController],
  providers: [
    GetUrlService,
    SignUpService,
    SignInService,
    SignOutService,
    UpdateUserService,
    SignOffService,
    BookmarkService,
    MyRecipesService,
    MyCommentsService,
  ],
})
export class UsersModule {}
