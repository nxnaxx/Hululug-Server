import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
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
