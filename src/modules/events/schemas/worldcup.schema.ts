import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Worldcup extends Document {
  @Prop()
  title: string;

  @Prop()
  count: number;
}

export const WorldcupSchema = SchemaFactory.createForClass(Worldcup);
