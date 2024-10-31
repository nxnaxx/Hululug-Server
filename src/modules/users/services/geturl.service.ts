import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetUrlService {
  constructor(private configService: ConfigService) {}

  getUrl() {
    const client_id = this.configService.get<string>('kakaoRestAPIKey');
    const redirect_uri = this.configService.get<string>('kakaoRedirectUri');

    return {
      login_url: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
    };
  }
}
