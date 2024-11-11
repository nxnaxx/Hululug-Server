import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectRamenDto {
  @ApiProperty({
    type: String,
    example: '6728603f2f3ce80106358df5',
  })
  @IsString()
  @IsNotEmpty()
  ramen_id: string;
}
