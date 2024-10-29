import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  getUrl() {
    const client_id = this.configService.get<string>('kakaoRestAPIKey');
    const redirect_uri = this.configService.get<string>('kakaoRedirectUri');

    return {
      loginUrl: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
    };
  }
}
