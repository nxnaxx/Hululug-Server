import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ramen extends Document {
  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop()
  count: number;
}

export const RamenSchema = SchemaFactory.createForClass(Ramen);
