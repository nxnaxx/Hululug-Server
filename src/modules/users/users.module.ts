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
} from './services';
import { AuthModule } from '@auth/auth.module';
import { AWSModule } from '@modules/aws/aws.module';
import { PreviewSchema, RecipePreview } from '@modules/recipes';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RecipePreview.name, schema: PreviewSchema },
    ]),
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
  ],
})
export class UsersModule {}
