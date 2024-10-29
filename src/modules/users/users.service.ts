import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dtos';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  getUrl() {
    const client_id = this.configService.get<string>('kakaoRestAPIKey');
    const redirect_uri = this.configService.get<string>('kakaoRedirectUri');

    return {
      loginUrl: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
    };
  }

  async getKakaoUser(code: string) {
    const accessToken = await this.getKakaoAccessToken(code);
    const email = await this.getKakaoUserEmail(accessToken);
    return { email, accessToken };
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

  async emailCheck(email: string): Promise<boolean> {
    const result = await this.userModel.findOne({ email }).exec();
    return !!result;
  }

  async nicknameCheck(nickname: string): Promise<boolean> {
    const result = await this.userModel.findOne({ nickname }).exec();
    return !!result;
  }

  async uploadImage(profileImage: Express.Multer.File) {
    // 추후 이미지 파일 서버 추가 필요
    return 'test.png';
  }

  async createUser(
    email: string,
    image: string,
    accessToken: string,
    createProfileDto: CreateProfileDto,
  ): Promise<User> {
    const { nickname, introduce } = createProfileDto;
    const newUser = new this.userModel({
      email,
      nickname,
      introduce,
      profileImage: image,
      accessToken,
      bookmark: [],
      myRecipes: [],
      myComments: [],
      likes: [],
    });
    return newUser.save();
  }
}
