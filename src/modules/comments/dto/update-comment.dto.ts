import { Types } from 'mongoose';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserId } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CommentParamsDto {
  @IsString()
  @Transform(({ value }) => value as Types.ObjectId)
  comment_id: Types.ObjectId;

  @IsString()
  @Transform(({ value }) => value as Types.ObjectId)
  recipe_id: Types.ObjectId;
}

export class CommentDBQueryDto extends CommentParamsDto {
  @IsString()
  @Transform(({ value }) => value as UserId)
  writer: UserId;
}

export class UpdatedCommentDto {
  @ApiProperty({
    type: String,
    example: '672cedcb84e1d115614c1234',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '라면 맛있겠다',
  })
  content: string;

  @ApiProperty({
    type: String,
    example: '2024-11-08T12:00:00.763Z',
  })
  updated_at?: Date;
}
