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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignOffService {
  constructor(
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signOff(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    const accessToken = user.access_token;
    if (!accessToken) {
      throw new BadRequestException('액세스 토큰이 없습니다.');
    }

    await this.unlinkKakaoAccount(accessToken);
    await this.userModel.findByIdAndUpdate(
      id,
      {
        access_token: '',
        is_deleted: true,
        bookmark: [],
      },
      { new: true },
    );
  }

  private async unlinkKakaoAccount(accessToken: string): Promise<void> {
    const adminKey = process.env.KAKAO_ADMIN_KEY;
    const url = 'https://kapi.kakao.com/v1/user/unlink';

    try {
      await firstValueFrom(
        this.httpService.post(url, null, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    } catch (error) {
      throw new HttpException(
        '카카오 연결 해제 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
