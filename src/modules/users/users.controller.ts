import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProfileDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUrlService, SignUpService, SignInService } from './services';

@Controller('users')
export class UsersController {
  constructor(
    private getUrlService: GetUrlService,
    private signInService: SignInService,
    private signUpService: SignUpService,
  ) {}

  @Get('/kakao/url')
  getUrl() {
    return this.getUrlService.getUrl();
  }

  @Post('/sessions')
  async signIn(@Body('code') code: string) {
    const { email, access_token } = await this.signUpService.getKakaoUser(code);
    const emailCheck = await this.signUpService.emailCheck(email);
    if (!emailCheck) {
      throw new NotFoundException('존재하지 않는 사용자입니다');
    }

    const updatedUser = await this.signInService.saveToken(email, access_token);
    return {
      _id: updatedUser._id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      introduce: updatedUser.introduce,
      profile_image: updatedUser.profile_image,
      bookmark: updatedUser.bookmark,
      my_recipes: updatedUser.my_recipes,
      my_comments: updatedUser.my_comments,
      likes: updatedUser.likes,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async signUp(
    @UploadedFile() profile_image: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const { code, nickname } = createProfileDto;
    const nicknameCheck = await this.signUpService.nicknameCheck(nickname);
    if (nicknameCheck) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다');
    }
    const { email, access_token } = await this.signUpService.getKakaoUser(code);
    const emailCheck = await this.signUpService.emailCheck(email);
    if (emailCheck) {
      throw new ConflictException('이미 존재하는 사용자입니다');
    }
    const image = await this.signUpService.uploadImage(profile_image);
    const newUser = await this.signUpService.createUser(
      email,
      image,
      access_token,
      createProfileDto,
    );
    return {
      _id: newUser._id,
      email: newUser.email,
      nickname: newUser.nickname,
      introduce: newUser.introduce,
      profile_image: newUser.profile_image,
      bookmark: newUser.bookmark,
      my_recipes: newUser.my_recipes,
      my_comments: newUser.my_comments,
      likes: newUser.likes,
    };
  }
}
