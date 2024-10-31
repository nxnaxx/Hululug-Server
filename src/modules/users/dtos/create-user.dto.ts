import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  introduce: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
