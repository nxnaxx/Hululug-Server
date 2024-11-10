import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export type ToggleAction = 'add' | 'remove';

export class ToggleActionDto {
  @ApiProperty({
    required: true,
    enum: ['add', 'remove'],
  })
  @IsEnum(['add', 'remove'])
  @IsNotEmpty()
  action: ToggleAction;
}
