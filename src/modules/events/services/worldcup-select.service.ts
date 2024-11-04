import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Worldcup } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class WorldcupSelectService {
  constructor(
    @InjectModel(Worldcup.name) private worldcupModel: Model<Worldcup>,
  ) {}

  async selectRamen(id: string) {
    await this.worldcupModel.findByIdAndUpdate(
      id,
      { $inc: { count: 1 } },
      { new: true },
    );
  }
}
