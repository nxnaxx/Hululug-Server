import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ramen } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class WorldcupRamenInfoService {
  constructor(@InjectModel(Ramen.name) private ramenModel: Model<Ramen>) {}

  async getRamenInfo(id: string): Promise<Ramen> {
    return await this.ramenModel.findById(id).exec();
  }
}
