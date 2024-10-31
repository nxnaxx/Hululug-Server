import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class SignInService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async saveToken(email: string, access_token: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email, is_deleted: false },
      { access_token: access_token },
      { new: true },
    );

    return updatedUser;
  }
}
