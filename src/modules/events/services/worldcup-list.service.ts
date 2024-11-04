import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Worldcup } from '../schemas';
import { Model } from 'mongoose';
import { Ramen } from '../interface';

@Injectable()
export class WorldcupListService {
  constructor(
    @InjectModel(Worldcup.name) private worldcupModel: Model<Worldcup>,
  ) {}

  async getRamenList(): Promise<{ ramen: Ramen[]; total_count: number }> {
    const ramen = (await this.worldcupModel
      .find()
      .sort({ count: -1 })
      .lean()) as Ramen[];

    let total_count = ramen.reduce((acc, cur) => acc + cur.count, 0);

    return { ramen, total_count };
  }
}
