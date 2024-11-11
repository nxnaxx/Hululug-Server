import { Types } from 'mongoose';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RamenInfoDto {
  @ApiProperty({
    type: String,
    example: '6728603f2f3ce80106358df5',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    type: String,
    example: '신라면',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @IsNumber()
  count: number;
}

export class GetWorldCupRamenDto {
  @ApiProperty({
    type: [RamenInfoDto],
  })
  ramen: [RamenInfoDto];

  @ApiProperty({
    type: Number,
    example: 30,
  })
  total_count: number;
}
