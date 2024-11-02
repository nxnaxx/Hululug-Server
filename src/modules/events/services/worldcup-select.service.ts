import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ramen, Worldcup } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class WorldcupSelectService {
  constructor(
    @InjectModel(Worldcup.name) private worldcupModel: Model<Worldcup>,
    @InjectModel(Ramen.name) private ramenModel: Model<Ramen>,
  ) {}

  async selectRamen(id: string) {
    await this.worldcupModel.findByIdAndUpdate(
      '67244c5dbd13fe2b2e6c8136',
      { $inc: { total_count: 1 } },
      { new: true },
    );

    await this.ramenModel.findByIdAndUpdate(
      id,
      { $inc: { count: 1 } },
      { new: true },
    );
  }
}
