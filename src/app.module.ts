import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database';

@Module({
  imports: [CustomConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
