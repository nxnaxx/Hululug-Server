import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { AWSModule } from '@modules/aws/aws.module';
import { RecipePreview, PreviewSchema } from './schema/recipe-preview.schema';
import { Recipe, RecipeSchema } from './schema/recipe.schema';
import { RecipesController } from './recipes.controller';
import { User, UserSchema } from '@modules/users/schemas';
import { RecipesService } from './recipes.service';
import { RecipeRepository } from './recipes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecipePreview.name, schema: PreviewSchema },
    ]),
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    AWSModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipeRepository],
  exports: [RecipesService, RecipeRepository],
})
export class RecipesModule {}
