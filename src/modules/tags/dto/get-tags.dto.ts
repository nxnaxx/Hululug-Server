import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class TagsDto {
  @ApiProperty({
    type: String,
    example: '6721a89a42a7d479b161b385',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    type: String,
    example: '간짬뽕',
  })
  @IsString()
  title: string;
}

export class GetTagsDto {
  @ApiProperty({
    type: [TagsDto],
  })
  tags: [TagsDto];
}
