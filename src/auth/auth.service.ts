import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '@modules/users/schemas';
import { stringToObjectId } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // JWT 토큰 생성
  async getJwtToken(id: string) {
    const payload = { id };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwtSecret'),
      }),
    };
  }

  // JWT 토큰 검증
  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtSecret'),
      });
      return { userId: payload.id };
    } catch (err) {
      throw new HttpException('토큰 검증 실패', HttpStatus.UNAUTHORIZED);
    }
  }

  // 회원인지 여부 확인
  async verifyUser(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      _id: stringToObjectId(userId),
    });
    return !!user;
  }
}
