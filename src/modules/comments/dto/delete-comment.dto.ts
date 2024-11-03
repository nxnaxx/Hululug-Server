import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserId } from '@common/decorators';
import { CommentParamsDto } from './update-comment.dto';

export class DeleteQueryDto extends CommentParamsDto {
  @IsString()
  @Transform(({ value }) => value as UserId)
  writer: UserId;
}
