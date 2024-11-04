import { IsNotEmpty } from 'class-validator';

export type ToggleAction = 'add' | 'remove';

export class ToggleActionDto {
  @IsNotEmpty()
  action: ToggleAction;
}
