import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import { HttpModule } from '@nestjs/axios';
import { GetUrlService, SignUpService, SignInService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [GetUrlService, SignUpService, SignInService],
})
export class UsersModule {}
