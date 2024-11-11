import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    type: String,
    example: 'dIdjmislZ7RY0uAL1uVoK3enlcuNLv4h6',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
