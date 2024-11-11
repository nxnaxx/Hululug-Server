import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

class CommentInfoDto {
  @ApiProperty({
    type: String,
    example: '672cef2d84e1d325614c2351',
  })
  @IsMongoId()
  _id?: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '672c99df92ac9973098f298b',
  })
  @IsMongoId()
  recipe_id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '672cebd284e1d325614c233d',
  })
  @IsString()
  writer: string;

  @ApiProperty({
    type: String,
    example: '나야~ 들기름',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: Date,
    example: '2024-11-07T16:47:41.488Z',
  })
  @IsString()
  created_at?: Date;

  @ApiProperty({
    type: Date,
    example: '2024-11-07T16:47:41.488Z',
  })
  @IsString()
  updated_at?: Date;
}

class CommentDto {
  @ApiProperty({
    type: CommentInfoDto,
  })
  @IsString()
  comment_info: CommentInfoDto;

  @ApiProperty({
    type: String,
    example: '들기름 라면',
  })
  @IsString()
  recipe_title: string;
}

export class GetCommentsDto {
  @ApiProperty({
    type: [CommentDto],
  })
  comments: [CommentDto];
}
