import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { CustomConfigModule } from '@config/config.module';

@Module({
  imports: [
    CustomConfigModule,
    MongooseModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          return {
            uri: configService.get<string>('databaseUrl'),
          };
        } catch (err) {
          console.error('MongoDB 연결 실패:', err);
        }
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
