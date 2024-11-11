import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'testtest@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'testBoy',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    type: String,
    example: 'hello world!',
  })
  @IsString()
  introduce: string;

  @ApiProperty({
    type: File,
    example: 'File',
  })
  @IsString()
  profile_image?: string;
}

export class GetUserInfoDto extends CreateUserDto {
  @ApiProperty({
    type: String,
    example: '6724d4624a07deb670311d79',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    type: String,
    example:
      'https://dr4twgka8dxga.cloudfront.net/profile/353ba3967b38867266d24eddf2999105e264c953931eab6097b3a31b10974865',
  })
  @IsString()
  @IsNotEmpty()
  profile_image: string;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_deleted: boolean;

  @ApiProperty({
    type: [String],
    example: ['672ce2c184e1d325614c2320', '672ca72692ac9973098f29b2'],
  })
  @IsArray()
  @IsNotEmpty()
  bookmark: [string];

  @ApiProperty({
    type: [String],
    example: ['672c99df92ac9973098f298c', '672caab192ac9973098f29cc'],
  })
  @IsArray()
  @IsNotEmpty()
  my_recipes: [string];

  @ApiProperty({
    type: [String],
    example: ['672ce2c184e1d325614c2320'],
  })
  @IsArray()
  @IsNotEmpty()
  my_comments: [string];

  @ApiProperty({
    type: [String],
    example: ['672ce2c184e1d325614c2320'],
  })
  @IsArray()
  @IsNotEmpty()
  likes: [string];
}
