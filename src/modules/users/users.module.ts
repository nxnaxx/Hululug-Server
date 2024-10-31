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
} from './services';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    GetUrlService,
    SignUpService,
    SignInService,
    SignOutService,
    UpdateUserService,
    SignOffService,
  ],
})
export class UsersModule {}
