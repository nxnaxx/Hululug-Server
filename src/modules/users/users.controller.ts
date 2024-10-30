import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProfileDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetUrlService,
  SignUpService,
  SignInService,
  SignOutService,
} from './services';
import { AuthGuard } from '@auth/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from '@auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private getUrlService: GetUrlService,
    private signInService: SignInService,
    private signUpService: SignUpService,
    private signOutService: SignOutService,
  ) {}

  // 카카오 로그인 url
  @Get('/kakao/url')
  getUrl() {
    return this.getUrlService.getUrl();
  }

  // 로그인
  @Post('/sessions')
  async signIn(
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, access_token } = await this.signUpService.getKakaoUser(code);
    const emailCheck = await this.signUpService.emailCheck(email);
    if (!emailCheck) {
      throw new NotFoundException('존재하지 않는 사용자입니다');
    }

    const updatedUser = await this.signInService.saveToken(email, access_token);

    // 쿠키 생성
    const { accessToken } = await this.authService.getJwtToken(
      updatedUser._id.toString(),
    );
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });

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

  // 회원가입
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async signUp(
    @UploadedFile() profile_image: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
    @Res({ passthrough: true }) res: Response,
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

    // 쿠키 생성
    const { accessToken } = await this.authService.getJwtToken(
      newUser._id.toString(),
    );
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });

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

  // 로그아웃
  @Delete('/sessions')
  @UseGuards(AuthGuard)
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = req.user.userId;
    await this.signOutService.signOut(id);
    res.clearCookie('token');
  }
}
