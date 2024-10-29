import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/kakao/url')
  getUrl() {
    return this.usersService.getUrl();
  }
}
