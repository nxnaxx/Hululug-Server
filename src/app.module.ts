import { Module } from '@nestjs/common';
import { CustomConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { RecipesModule } from '@modules/recipes';
import { AwsModule } from './modules/aws/aws.module';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    AwsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
