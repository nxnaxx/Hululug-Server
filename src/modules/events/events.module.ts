import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Worldcup, WorldcupSchema } from './schemas';
import { WorldcupListService, WorldcupSelectService } from './services';
import { WorldcupController } from './worldcup.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Worldcup.name, schema: WorldcupSchema },
    ]),
  ],
  controllers: [WorldcupController],
  providers: [WorldcupListService, WorldcupSelectService],
})
export class EventsModule {}
