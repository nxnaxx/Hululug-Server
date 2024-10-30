import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SignOutService {
  constructor(
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signOut(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    const accessToken = user.access_token;
    if (!accessToken) {
      throw new BadRequestException('액세스 토큰이 없습니다.');
    }
    await this.logoutKakaoAccount(accessToken);
    await this.userModel.findOneAndUpdate(
      { _id: id },
      { access_token: '' },
      { new: true },
    );
  }

  private async logoutKakaoAccount(accessToken: string): Promise<void> {
    const logoutUrl = 'https://kapi.kakao.com/v1/user/logout';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await firstValueFrom(this.httpService.post(logoutUrl, null, { headers }));
    } catch (error) {
      throw new HttpException(
        '카카오 로그아웃 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
