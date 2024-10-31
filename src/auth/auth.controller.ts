import { Controller, UseGuards, Query, Get, Req } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserId, UserIdParam } from '@common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 토큰 생성 (추후 삭제)
  @Get('token')
  async getJwtToken(@Query('id') id: string) {
    return await this.authService.getJwtToken(id);
  }

  // AuthGuard 테스트 (추후 삭제)
  @UseGuards(AuthGuard)
  @Get('status')
  testGuard(@UserIdParam() id: UserId) {
    if (!id) return `비로그인 상태`;
    return `작성자 ID: ${id}`;
  }
}
