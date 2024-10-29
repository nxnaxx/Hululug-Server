import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateProfileDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/kakao/url')
  getUrl() {
    return this.usersService.getUrl();
  }

  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async signUp(
    @UploadedFile() profileImage: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const { code, nickname } = createProfileDto;
    const nicknameCheck = await this.usersService.nicknameCheck(nickname);
    if (nicknameCheck) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다');
    }
    const { email, accessToken } = await this.usersService.getKakaoUser(code);
    const emailCheck = await this.usersService.emailCheck(email);
    if (emailCheck) {
      throw new ConflictException('이미 존재하는 사용자입니다');
    }
    const image = await this.usersService.uploadImage(profileImage);
    const newUser = await this.usersService.createUser(
      email,
      image,
      accessToken,
      createProfileDto,
    );
    return {
      _id: newUser._id,
      email: newUser.email,
      nickname: newUser.nickname,
      introduce: newUser.introduce,
      profileImage: newUser.profileImage,
      bookmark: newUser.bookmark,
      myRecipes: newUser.myRecipes,
      myComments: newUser.myComments,
      likes: newUser.likes,
    };
  }
}
