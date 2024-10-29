import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  introduce: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
