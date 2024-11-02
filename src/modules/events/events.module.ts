import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ramen, RamenSchema, Worldcup, WorldcupSchema } from './schemas';
import {
  WorldcupListService,
  WorldcupRamenInfoService,
  WorldcupSelectService,
} from './services';
import { WorldcupController } from './worldcup.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Worldcup.name, schema: WorldcupSchema },
      { name: Ramen.name, schema: RamenSchema },
    ]),
  ],
  controllers: [WorldcupController],
  providers: [
    WorldcupListService,
    WorldcupRamenInfoService,
    WorldcupSelectService,
  ],
})
export class EventsModule {}
