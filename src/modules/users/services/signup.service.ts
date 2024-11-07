import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas';
import { CreateUserDto } from '../dtos';
import { AWSService } from '@modules/aws/aws.service';

@Injectable()
export class SignUpService {
  constructor(
    private aWSService: AWSService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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

  async createUser(image: string, createUserDto: CreateUserDto): Promise<User> {
    const { email, nickname, introduce } = createUserDto;
    const newUser = new this.userModel({
      email,
      nickname,
      introduce,
      profile_image: image,
      access_token: '',
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
  ) {
    const user = await this.userModel.findOne({ email });
    await this.aWSService.deleteFileFromS3(
      user.profile_image.split('/').pop(),
      'profile',
    );

    return await this.userModel.findOneAndUpdate(
      { email },
      {
        nickname,
        introduce,
        profile_image: image,
        is_deleted: false,
      },
      { new: true },
    );
  }
}
