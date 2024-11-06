import { UserId } from '@common/decorators';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { RecipePreview } from './schema/recipe-preview.schema';
import { Recipe } from './schema/recipe.schema';
import { User } from '@modules/users/schemas';
import { WriterDto, EditRecipeDto } from './dto';

@Injectable()
export class RecipeRepository {
  constructor(
    @InjectModel(RecipePreview.name) private previewModel: Model<RecipePreview>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // 레시피 목록 필터링
  async filteredRecipes(
    dbQuery: object,
    sortOption: { [key: string]: SortOrder },
    limit: number,
  ): Promise<RecipePreview[]> {
    return await this.previewModel
      .find(dbQuery)
      .sort(sortOption)
      .limit(limit + 1) // nestCursor 위해서 +1
      .lean()
      .exec();
  }

  // 키워드로 레시피 검색
  async findRecipesByKeyword(
    keyword: string,
    dbQuery: { created_at: { $lt: number } } | {},
    limit: number,
  ): Promise<RecipePreview[]> {
    const keywords = keyword.trim().split(/\s+/);
    const regexes = keywords.map((keyword) => ({
      title: new RegExp(keyword, 'i'),
    }));

    return await this.previewModel
      .find({ $and: [...regexes, dbQuery] })
      .sort({ created_at: -1 })
      .limit(limit + 1) // nestCursor 위해서 +1
      .lean()
      .exec();
  }

  // userId로 유저 정보 반환
  async findUser(userId: Types.ObjectId): Promise<WriterDto> {
    const user = await this.userModel
      .findOne(
        { _id: userId },
        { _id: 0, nickname: 1, profile_image: 1, introduce: 1 },
      )
      .lean()
      .exec();

    if (!user) {
      return {
        nickname: '익명',
        profile_image:
          'https://dr4twgka8dxga.cloudfront.net/profile/3ed5d0f311178bec20bb5263c42b81f3954ace60c6e718b10c84507d8d0ade04',
        introduce: '자기소개가 없습니다.',
      };
    }

    return user;
  }

  // 레시피 상세 불러오기
  async findRecipeById(recipeId: Types.ObjectId): Promise<Recipe> {
    const recipe = await this.recipeModel
      .findOne({ _id: recipeId })
      .select({ comments: 0 })
      .lean()
      .exec();
    if (!recipe) throw new NotFoundException('레시피가 존재하지 않습니다.');
    return recipe;
  }

  // 레시피 존재 여부 확인
  async checkRecipeExists(
    recipeId: Types.ObjectId,
    userId?: Types.ObjectId,
  ): Promise<boolean> {
    let query: object = { _id: recipeId };

    if (userId) query = { ...query, writer: userId };

    const recipeExists = await this.recipeModel.exists(query);

    if (!recipeExists) {
      throw new NotFoundException('레시피가 존재하지 않거나 권한이 없습니다.');
    }

    return recipeExists !== null;
  }

  async saveRecipe(recipes: Recipe): Promise<Recipe> {
    return await new this.recipeModel(recipes).save();
  }

  async savePreview(recipes: RecipePreview): Promise<RecipePreview> {
    return await new this.previewModel(recipes).save();
  }

  async saveMyRecipe(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<Recipe> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { my_recipes: recipeId },
    });
    return;
  }

  async saveMyLikes(userId: UserId, recipeId: Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { likes: recipeId },
    });
    return;
  }

  async removeMyLikes(userId: UserId, recipeId: Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { likes: recipeId },
    });
    return;
  }

  async saveMyBookmark(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { bookmark: recipeId },
    });
    return;
  }

  async removeMyBookmark(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { bookmark: recipeId },
    });
    return;
  }

  // 동일한 thumbnail이 존재하는지 여부
  async hasSameThumbnail(
    recipeId: Types.ObjectId,
    thumbnailUrl: string,
  ): Promise<boolean> {
    const exists = await this.recipeModel.exists({
      _id: recipeId,
      thumbnail: thumbnailUrl,
    });
    return exists != null;
  }

  // 레시피 ID로 thumbnail url 검색
  async findThumbnail(recipeId: Types.ObjectId): Promise<string> {
    const recipe = await this.recipeModel
      .findOne({ _id: recipeId })
      .select('thumbnail -_id')
      .lean()
      .exec();
    if (!recipe) throw new NotFoundException('레시피를 찾을 수 없습니다.');
    return recipe.thumbnail;
  }

  // 레시피 수정
  async updateRecipe(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
    data: EditRecipeDto,
  ): Promise<void> {
    const updatedRecipe = await this.recipeModel.findOneAndUpdate(
      { _id: recipeId, writer: userId },
      { ...data },
    );

    if (!updatedRecipe) {
      throw new ForbiddenException('레시피의 수정 권한이 없습니다.');
    }

    const { introduce, ingredients, cooking_steps, ...rest } = data;
    await this.previewModel.findOneAndUpdate(
      { recipe_id: recipeId, writer: userId },
      { ...rest },
    );
    return;
  }

  // 레시피 삭제
  async deleteRecipe(
    userId: Types.ObjectId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    await Promise.all([
      this.recipeModel.findOneAndDelete({
        _id: recipeId,
        writer: userId,
      }),
      this.previewModel.findOneAndDelete({
        recipe_id: recipeId,
        writer: userId,
      }),
    ]);
    return;
  }

  async deleteMyRecipe(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { my_recipes: recipeId },
    });
    return;
  }

  // 레시피 좋아요 및 내 좋아요 목록 추가
  async addLike(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<{ likes: number }> {
    const likeExists = await this.userModel.findOne({
      _id: userId,
      likes: { $in: [recipeId] },
    });

    if (likeExists) throw new BadRequestException('이미 좋아요를 눌렀습니다.');

    await Promise.all([
      this.recipeModel.updateOne(
        { _id: recipeId },
        { $inc: { likes: 1 } },
        { timestamps: false },
      ),
      this.previewModel.updateOne(
        { recipe_id: recipeId },
        { $inc: { likes: 1 } },
      ),
      this.saveMyLikes(userId, recipeId),
    ]);

    const updatedRecipe = await this.recipeModel.findOne(
      { _id: recipeId },
      { _id: 0, likes: 1 },
    );

    return { likes: updatedRecipe.likes };
  }

  // 레시피 좋아요 및 내 좋아요 목록 취소
  async removeLike(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<{ likes: number }> {
    const likeExists = await this.userModel.findOne({
      _id: userId,
      likes: { $in: [recipeId] },
    });

    if (!likeExists) {
      throw new BadRequestException(
        '레시피에 좋아요가 등록되지 않아 취소할 수 없습니다.',
      );
    }

    await Promise.all([
      this.recipeModel.updateOne(
        { _id: recipeId, likes: { $gt: 0 } },
        { $inc: { likes: -1 } },
        { timestamps: false },
      ),
      this.previewModel.updateOne(
        { recipe_id: recipeId, likes: { $gt: 0 } },
        { $inc: { likes: -1 } },
      ),
      this.removeMyLikes(userId, recipeId),
    ]);

    const updatedRecipe = await this.recipeModel.findOne(
      { _id: recipeId },
      { _id: 0, likes: 1 },
    );

    return { likes: updatedRecipe.likes };
  }

  // 레시피 내 북마크 목록 추가
  async addBookmark(userId: UserId, recipeId: Types.ObjectId): Promise<void> {
    const bookmarkExists = await this.userModel.findOne({
      _id: userId,
      bookmark: { $in: [recipeId] },
    });

    if (bookmarkExists) {
      throw new BadRequestException('이미 북마크가 존재합니다.');
    }

    return await this.saveMyBookmark(userId, recipeId);
  }

  // 레시피 내 북마크 목록 추가
  async removeBookmark(
    userId: UserId,
    recipeId: Types.ObjectId,
  ): Promise<void> {
    const bookmarkExists = await this.userModel.findOne({
      _id: userId,
      bookmark: { $in: [recipeId] },
    });

    if (!bookmarkExists) {
      throw new BadRequestException(
        '북마크가 존재하지 않아 취소할 수 없습니다.',
      );
    }

    return await this.removeMyBookmark(userId, recipeId);
  }
}
