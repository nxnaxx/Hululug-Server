import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  title: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
