import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class SignOutService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
}
