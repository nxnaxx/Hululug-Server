import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User } from '../schemas';
import { CreateUserDto } from '../dtos';

@Injectable()
export class SignUpService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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

  async nicknameCheck(email: string, nickname: string): Promise<boolean> {
    const result = await this.userModel
      .findOne({ email: { $ne: email }, nickname })
      .exec();
    return !!result;
  }

  async emailCheck(email: string): Promise<Number> {
    const result1 = await this.userModel
      .findOne({ email, is_deleted: false })
      .exec();
    if (!!result1) {
      return 0;
    }
    const result2 = await this.userModel
      .findOne({ email, is_deleted: true })
      .exec();
    if (!!result2) {
      return 2;
    } else {
      return 1;
    }
  }

  async uploadImage(profileImage: Express.Multer.File) {
    // 추후 이미지 파일 서버 추가 필요
    return 'test.png';
  }

  async createUser(
    email: string,
    image: string,
    access_token: string,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const { nickname, introduce } = createUserDto;
    const newUser = new this.userModel({
      email,
      nickname,
      introduce,
      profile_image: image,
      access_token,
      is_deleted: false,
      bookmark: [],
      my_recipes: [],
      my_comments: [],
      likes: [],
    });
    return newUser.save();
  }

  async updateUser(
    email: string,
    nickname: string,
    introduce: string,
    image: string,
    access_token: string,
  ) {
    return await this.userModel.findOneAndUpdate(
      { email },
      {
        nickname,
        introduce,
        profile_image: image,
        access_token,
        is_deleted: false,
      },
      { new: true },
    );
  }
}
