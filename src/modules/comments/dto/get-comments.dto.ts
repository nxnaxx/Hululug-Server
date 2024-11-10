import { Types } from 'mongoose';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentWriterDto {
  @ApiProperty({
    type: String,
    example: '조림요정',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    type: String,
    example: 'https://dr4twgka8dxga.cloudfront.net/recipes/231414125123123214',
  })
  @IsString()
  profile_image: string;
}

export class GetCommentDto {
  @ApiProperty({
    type: String,
    example: '672cedcb84e1d115614c1234',
  })
  _id?: Types.ObjectId;

  @ApiProperty({
    type: CommentWriterDto,
  })
  writer: CommentWriterDto;

  @ApiProperty({
    type: String,
    example: '라면 맛있겠다',
  })
  content: string;

  @ApiProperty({
    type: String,
    example: '2024-11-07T12:00:00.763Z',
  })
  created_at?: Date;

  @ApiProperty({
    type: String,
    example: '2024-11-08T12:00:00.763Z',
  })
  updated_at?: Date;
}
