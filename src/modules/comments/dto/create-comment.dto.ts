import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserId } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class ReqCommentDto {
  @ApiProperty({
    type: String,
    example: '맛있겠다!',
  })
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
