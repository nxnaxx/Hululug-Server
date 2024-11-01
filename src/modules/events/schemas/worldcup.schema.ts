import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Worldcup extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Ramen' }] })
  ramen: MongooseSchema.Types.ObjectId[];

  @Prop()
  total_count: number;
}

export const WorldcupSchema = SchemaFactory.createForClass(Worldcup);
