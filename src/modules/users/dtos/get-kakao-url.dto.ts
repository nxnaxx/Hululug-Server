import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetKakaoUrlDto {
  @ApiProperty({
    type: String,
    example:
      'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id={???}&redirect_uri={???}',
  })
  @IsString()
  login_url: string;
}
