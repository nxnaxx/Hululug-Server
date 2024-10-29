import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
