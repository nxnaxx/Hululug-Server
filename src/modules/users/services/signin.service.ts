import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignInService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getCode() {}

  async getKakaoUser(code: string) {
    const access_token = await this.getKakaoAccessToken(code);
    const email = await this.getKakaoUserEmail(access_token);
    return { email, access_token };
  }

  private async getKakaoAccessToken(code: string): Promise<string> {
    const requestUrl = 'https://kauth.kakao.com/oauth/token';
    const params = {
      grant_type: 'authorization_code',
      client_id: this.configService.get('kakaoRestAPIKey'),
      redirect_uri: this.configService.get('kakaoRedirectUri'),
      code,
    };

    const response = await firstValueFrom(
      this.httpService.post(requestUrl, null, { params }),
    );
    return response.data.access_token;
  }

  private async getKakaoUserEmail(accessToken: string): Promise<string> {
    const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await firstValueFrom(
      this.httpService.get(userInfoUrl, { headers }),
    );
    return response.data.kakao_account.email;
  }

  async saveToken(email: string, access_token: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email, is_deleted: false },
      { access_token: access_token },
      { new: true },
    );

    return updatedUser;
  }
}
