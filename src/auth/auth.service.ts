import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Test } from './test/test.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Test.name) private readonly testModel: Model<Test>, // 변경 필요
  ) {}

  // JWT 토큰 생성
  async getJwtToken(id: string, name: string, email: string) {
    const payload = { id, name, email };

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

  // 회원인지 여부 확인(추후 모델 수정 필요)
  async verifyUser(userId: string): Promise<boolean> {
    const objectId = new Types.ObjectId(userId);
    const user = await this.testModel.findOne({ _id: objectId });
    return !!user;
  }
}
