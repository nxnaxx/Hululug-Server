import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserId } from '@common/decorators';

export class ReqCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateCommentDto extends ReqCommentDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value as UserId)
  userId: UserId;
}
