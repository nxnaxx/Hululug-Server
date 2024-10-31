import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetUrlService,
  SignUpService,
  SignInService,
  SignOutService,
  UpdateUserService,
  SignOffService,
} from './services';
import { AuthGuard } from '@auth/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from '@auth/auth.service';
import { User } from './schemas';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private getUrlService: GetUrlService,
    private signInService: SignInService,
    private signUpService: SignUpService,
    private signOutService: SignOutService,
    private updateUserService: UpdateUserService,
    private signOffService: SignOffService,
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

    const updatedUser = await this.signInService.saveToken(email, access_token);
    if (!updatedUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다');
    }

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
      is_deleted: updatedUser.is_deleted,
      bookmark: updatedUser.bookmark,
      my_recipes: updatedUser.my_recipes,
      my_comments: updatedUser.my_comments,
      likes: updatedUser.likes,
    };
  }

  // 회원가입
  @Post()
  @UseInterceptors(FileInterceptor('profile_image'))
  async signUp(
    @UploadedFile() profile_image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { nickname, introduce, code } = createUserDto;

    const { email, access_token } = await this.signUpService.getKakaoUser(code);

    const nicknameCheck = await this.signUpService.nicknameCheck(
      email,
      nickname,
    );
    if (nicknameCheck) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다');
    }

    const emailCheck = await this.signUpService.emailCheck(email);
    if (emailCheck === 0) {
      throw new ConflictException('이미 존재하는 사용자입니다');
    }

    const image = await this.signUpService.uploadImage(profile_image);

    let updatedUser: User;

    if (emailCheck === 1) {
      updatedUser = await this.signUpService.createUser(
        email,
        image,
        access_token,
        createUserDto,
      );
    } else {
      updatedUser = await this.signUpService.updateUser(
        email,
        nickname,
        introduce,
        image,
        access_token,
      );
    }

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
      is_deleted: updatedUser.is_deleted,
      bookmark: updatedUser.bookmark,
      my_recipes: updatedUser.my_recipes,
      my_comments: updatedUser.my_comments,
      likes: updatedUser.likes,
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

  // 회원정보 수정
  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile_image'))
  async updateUser(
    @UploadedFile() profile_image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const { nickname, introduce } = updateUserDto;
    const id = req.user.userId;

    const nicknameCheck = await this.updateUserService.nicknameCheck(
      id,
      nickname,
    );
    if (nicknameCheck) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다');
    }

    const image = await this.signUpService.uploadImage(profile_image);

    const updatedUser = await this.updateUserService.updateUser(
      id,
      nickname,
      introduce,
      image,
    );

    return {
      _id: updatedUser._id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      introduce: updatedUser.introduce,
      profile_image: updatedUser.profile_image,
      is_deleted: updatedUser.is_deleted,
      bookmark: updatedUser.bookmark,
      my_recipes: updatedUser.my_recipes,
      my_comments: updatedUser.my_comments,
      likes: updatedUser.likes,
    };
  }

  // 회원탈퇴
  @Delete()
  @UseGuards(AuthGuard)
  async signOff(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = req.user.userId;
    await this.signOffService.signOff(id);
    res.clearCookie('token');
  }
}
