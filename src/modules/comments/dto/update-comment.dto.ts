import { Types } from 'mongoose';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserId } from '@common/decorators';

export class CommentDBQueryDto {
  @IsString()
  @Transform(({ value }) => value as UserId)
  writer: UserId;

  @IsString()
  @Transform(({ value }) => value as Types.ObjectId)
  recipe_id: Types.ObjectId;

  @IsString()
  @Transform(({ value }) => value as Types.ObjectId)
  comment_id: Types.ObjectId;
}
