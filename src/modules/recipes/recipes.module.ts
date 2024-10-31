import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { RecipePreview, PreviewSchema } from './recipes.schema';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeMongoRepository } from './recipes.repository';
import { User, UserSchema } from '@modules/users/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecipePreview.name, schema: PreviewSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipeMongoRepository],
  exports: [RecipesService],
})
export class RecipesModule {}
