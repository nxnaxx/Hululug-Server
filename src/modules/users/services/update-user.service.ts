import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class UpdateUserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(
    id: string,
    nickname: string,
    introduce: string,
    image: string,
  ) {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { nickname, introduce, profile_image: image },
      { new: true },
    );
  }

  async nicknameCheck(id: string, nickname: string): Promise<boolean> {
    const result = await this.userModel
      .findOne({ _id: { $ne: id }, nickname })
      .exec();
    return !!result;
  }
}
