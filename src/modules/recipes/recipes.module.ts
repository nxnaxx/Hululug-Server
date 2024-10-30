import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipePreview, PreviewSchema } from './recipes.schema';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeMongoRepository } from './recipes.repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: RecipePreview.name, schema: PreviewSchema },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipeMongoRepository],
  exports: [RecipesService, RecipeMongoRepository],
})
export class RecipesModule {}
