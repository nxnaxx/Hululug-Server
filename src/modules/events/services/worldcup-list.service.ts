import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Worldcup } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class WorldcupListService {
  constructor(
    @InjectModel(Worldcup.name) private worldcupModel: Model<Worldcup>,
  ) {}

  async getRamenList(): Promise<Worldcup> {
    return await this.worldcupModel
      .findOne({ _id: '67244c5dbd13fe2b2e6c8136' })
      .exec();
  }
}
