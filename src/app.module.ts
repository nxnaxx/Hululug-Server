import { Module } from '@nestjs/common';
import { CustomConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { RecipesModule } from '@modules/recipes';
import { AWSModule } from './modules/aws/aws.module';
import { EventsModule } from '@modules/events/events.module';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    AWSModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
