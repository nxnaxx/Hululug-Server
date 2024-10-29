import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['token'];

    // 토큰이 존재하지 않다면 비로그인 상태
    if (!token) {
      request.user = null;
      return true;
    }

    // 토큰 검증
    const user = this.authService.validateToken(token);
    request.user = user;

    // 회원 여부 확인
    const verifyUser = await this.authService.verifyUser(user.userId);
    if (!verifyUser) {
      throw new HttpException('회원이 아닙니다.', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
