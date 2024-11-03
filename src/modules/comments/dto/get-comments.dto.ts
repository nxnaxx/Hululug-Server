import { Types } from 'mongoose';
import { IsString } from 'class-validator';

export class CommentWriterDto {
  @IsString()
  nickname: string;

  @IsString()
  profile_image: string;
}

export class GetCommentDto {
  _id?: Types.ObjectId;
  writer: CommentWriterDto;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}
