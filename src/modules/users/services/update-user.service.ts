import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { AWSService } from '@modules/aws/aws.service';

@Injectable()
export class UpdateUserService {
  constructor(
    private aWSService: AWSService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateUser(
    id: string,
    nickname: string,
    introduce: string,
    image: string,
  ) {
    const user = await this.userModel.findById(id);
    await this.aWSService.deleteFileFromS3(
      user.profile_image.split('/').pop(),
      'profile',
    );

    return await this.userModel.findByIdAndUpdate(
      id,
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
