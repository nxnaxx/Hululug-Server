import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
